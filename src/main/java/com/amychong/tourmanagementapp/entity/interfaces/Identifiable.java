package com.amychong.tourmanagementapp.entity.interfaces;

public interface Identifiable<T> {
    void setId(T id);
    T getId();
}
