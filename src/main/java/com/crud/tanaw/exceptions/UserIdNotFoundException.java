package com.crud.tanaw.exceptions;

public class UserIdNotFoundException extends RuntimeException {
    UserIdNotFoundException(String message) {
        super(message);
    }
}
