//package com.crud.tanaw.exceptions;
//
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.ControllerAdvice;
//import org.springframework.web.bind.annotation.ExceptionHandler;
//
//@ControllerAdvice
//public class GlobalExceptionHandler {
//
//    @ExceptionHandler(ResourceNotFoundException.class)
//    public String handleResourceNotFound(ResourceNotFoundException ex, Model model) {
//        model.addAttribute("message", ex.getMessage());
//        return "error/error";  // Thymeleaf error page
//    }
//
//    @ExceptionHandler(Exception.class)
//    public String handleGenericException(Exception ex, Model model) {
//        model.addAttribute("message", "That's something were working on, sorry :(" );
//        return "error/error";
//    }
//}
