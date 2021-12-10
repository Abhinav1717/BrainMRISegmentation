from django.shortcuts import render,HttpResponse
from django.templatetags.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


import os
import json
from zipfile import ZipFile
import shutil
from glob import glob

#Data
import random
import numpy as np
import pandas as pd
from PIL import Image
import base64
import io
# import matplotlib.pyplot as plt
# plt.style.use("dark_background")

#Image
import cv2 as cv
from skimage.io import imread, imshow, concatenate_images
from skimage.transform import resize
from skimage.morphology import label
from scipy import signal


#keras
import tensorflow as tf
from tensorflow.keras import Input
from tensorflow.keras.models import Model, load_model, save_model
from tensorflow.keras.layers import *
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, TensorBoard

from tensorflow.keras import backend as K
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Create your views here.

IMG_SIZE = (256,256)

def naive_inception_module(layer_in, filters):
    f1 = f2 = f3 = filters
    # 1x1 conv
    conv1 = Conv2D(f1, (1,1), padding='same', activation='relu')(layer_in)
    # 3x3 conv
    conv3 = Conv2D(f2, (3,3), padding='same', activation='relu')(layer_in)
    # 5x5 conv
    conv5 = Conv2D(f3, (5,5), padding='same', activation='relu')(layer_in)
    # 7x7 conv
    #   conv7 = Conv2D(f3, (7,7), padding='same', activation='relu')(layer_in)
    # 3x3 max pooling
    pool = MaxPooling2D((3,3), strides=(1,1), padding='same')(layer_in)
    # concatenate filters, assumes filters/channels last
    layer_out = concatenate([conv1, conv3, conv5, pool], axis=-1)
    return layer_out

def im2json(im):
    _, imdata = cv.imencode('.JPG',im)
#     jstr = json.dumps({"image": base64.b64encode(imdata).decode('ascii')})
    jstr = base64.b64encode(imdata).decode('ascii')
    jstr = "data:image/jpeg;base64,"+jstr
    return jstr

def uNet(input_size = (256,256,3)):
    #Input Layer
    inputs = Input(input_size)
    #Encoder network
    conv1 = naive_inception_module(inputs,16)
    pool1 = MaxPooling2D(pool_size= (2,2))(conv1)

    conv2 = naive_inception_module(pool1,32)
    pool2 = MaxPooling2D(pool_size= (2,2))(conv2)

    conv3 = naive_inception_module(pool2,64)
    pool3 = MaxPooling2D(pool_size= (2,2))(conv3)

    conv4 = naive_inception_module(pool3,128)
    pool4 = MaxPooling2D(pool_size= (2,2))(conv4)

    conv5 = naive_inception_module(pool4,256)

    #decoder network
    up6 = Conv2DTranspose(128, (2,2), strides = (2,2), padding = "same")(conv5)
    up6 = concatenate([up6, conv4], axis = 3)
    conv6 = naive_inception_module(up6, 128)

    up7 = Conv2DTranspose(64, (2,2), strides = (2,2), padding = "same")(conv6)
    up7 = concatenate([up7, conv3], axis = 3)
    conv7 = naive_inception_module(up7, 64)

    up8 = Conv2DTranspose(32, (2,2), strides = (2,2), padding = "same")(conv7)
    up8 = concatenate([up8, conv2], axis = 3)
    conv8 = naive_inception_module(up8, 32)

    up9 = Conv2DTranspose(16, (2,2), strides = (2,2), padding = "same")(conv8)
    up9 = concatenate([up9, conv1], axis = 3)
    conv9 = naive_inception_module(up9, 16)

    #output layer
    conv10 = Conv2D(1, (1,1), activation= "sigmoid")(conv9)

    model = Model(inputs = [inputs], outputs = [conv10])

    return model

def initialize_model():
    model = uNet()
    model_path = ".\\static\\unet_weights_2_12.h5"
    model.load_weights(model_path)
    return model

@csrf_exempt
def index(request):
    body = request.body.decode('utf-8')
    body = json.loads(body)
    if("images" in body and body['images'] != None and len(body['images']) > 0):
        # try:
            model = initialize_model()
            predicted_images = []
            for encoded_image in body['images']:
                #decoding image from BASE64
                decoded_image = base64.b64decode(encoded_image)
                image = Image.open(io.BytesIO(decoded_image))
                image_np = np.array(image)
                image_np = cv.resize(image_np ,IMG_SIZE)
                
                print("decoding complete")
                #Preprocessing before passing into model
                preprocessed_image = cv.cvtColor(image_np, cv.COLOR_BGR2RGB)
                rgb_image = preprocessed_image
                
                preprocessed_image= cv.resize(preprocessed_image ,IMG_SIZE)
                preprocessed_image  = preprocessed_image / 255
                preprocessed_image = preprocessed_image[np.newaxis, :, :, :]

                print("preprocessing complete")
                #Passing the image into model
                prediction_mask = model(preprocessed_image)

                print("prediction complete")
                #Postprocessing Predicted Mask (Threshold = 0.5)
                print(prediction_mask.shape)
                post_processed_mask = np.squeeze(prediction_mask)
                post_processed_mask = np.array(np.squeeze(post_processed_mask) > 0.5, dtype = np.uint8)
                post_processed_mask = post_processed_mask * 255

                print("post processing complete")
                #Using Convolution Edge Detection
                horizontal_filer = np.asarray([[1,2,1],[0,0,0],[-1,-2,-1]])
                vertical_filter = np.asarray([[1,0,-1],[2,0,-2],[1,0,-1]])

                horizontal_edges = signal.convolve(post_processed_mask,horizontal_filer,mode='valid')
                vertical_edges = signal.convolve(post_processed_mask,vertical_filter,mode='valid')

                mask_edges = np.sqrt(horizontal_edges*horizontal_edges + vertical_edges*vertical_edges)

                print("edge extraction complete")
                #Superimposing mask_edges on actual image
                mask_edges = cv.resize(mask_edges,(256,256))
                mask_edges_red = np.dstack((np.zeros((256,256)),np.zeros((256,256)), mask_edges))

                predicted_image = rgb_image + mask_edges_red
                predicted_image = im2json(predicted_image)
                predicted_images.append(predicted_image)

#                 mask_edges_red = im2json(mask_edges_red)
#                 predicted_images.append(mask_edges_red)

            response = {}
            response['encoded_list_of_images'] = predicted_images
            response['message'] = "Prediction Successful"
            response['status'] = 200
            # print(response)
            return JsonResponse(response, safe = False)
        # except:
            # response = {}
            # response['message'] = "Something went wrong"
            # response['status'] = 500
            # return JsonResponse(response)
    else:
        response = {}
        response['message'] = "The list of images cannot be empty or null"
        response['status'] = 406
        return JsonResponse(response)