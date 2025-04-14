package com.HolosINC.Holos.configuration;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.web.bind.annotation.ExceptionHandler;

public class ExceptionHandlerConfiguration {

   @ExceptionHandler(Exception.class)
   public String defaultErrorHandler(HttpServletRequest request,  Exception ex)  {
        request.setAttribute("jakarta.servlet.error.request_uri", request.getPathInfo());
        request.setAttribute("jakarta.servlet.error.status_code", 400);
        request.setAttribute("exeption", ex);
        return "exception";
    }
}