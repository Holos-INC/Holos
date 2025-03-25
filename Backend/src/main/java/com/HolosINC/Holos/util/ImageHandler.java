package com.HolosINC.Holos.util;

import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.HolosINC.Holos.exceptions.ResourceNotFoundException;

@Component
public class ImageHandler {
    
    public byte[] getBytes(MultipartFile image) {
        try {
            return image.getBytes();
        } catch (IOException e) {
            throw new ResourceNotFoundException("Error al obtener la imagen");
        }
    }
}
