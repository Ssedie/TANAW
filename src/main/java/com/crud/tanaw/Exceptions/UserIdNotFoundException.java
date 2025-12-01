package com.crud.tanaw.Exceptions;

public class UserIdNotFoundException extends RuntimeException {
    UserIdNotFoundException(String message) {
        super(message);
    }
}
