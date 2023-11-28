package com.amychong.tourmanagementapp.service.S3;

import java.util.List;

public interface S3Service {
  public byte[] getObject(String key);

  public void putObject(String key, byte[] file);

  void deleteObject(String key);

  public void deleteObjects(List<String> keys);
}
