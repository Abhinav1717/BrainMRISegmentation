from django.shortcuts import render,HttpResponse
from django.templatetags.static import static

import os
import json
from zipfile import ZipFile
import shutil
from glob import glob
from tqdm import tqdm

#Data
import random
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
plt.style.use("dark_background")

#Image
import cv2 as cv
from skimage.io import imread, imshow, concatenate_images
from skimage.transform import resize
from skimage.morphology import label

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
    model.load_weights(static("unet_weights_2_12.h5"))

def index(request):
    initialize_model()
    return HttpResponse("index page")
