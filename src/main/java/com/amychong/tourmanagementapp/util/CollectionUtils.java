package com.amychong.tourmanagementapp.util;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class CollectionUtils {

    public static <T> List<T> nullToEmpty(List<T> theList) {
        return theList == null ? Collections.emptyList() : theList;
    }

    public static <T extends DeepCopyable<T>> List<T> deepCopy(List<T> theList) {
        return nullToEmpty(theList).stream().map(el -> el.deepCopy()).collect(Collectors.toList());
    }
}
