package com.amychong.tourmanagementapp.entity;

public interface Identifiable<T> {
    void setId(T id);
    T getId();
}
