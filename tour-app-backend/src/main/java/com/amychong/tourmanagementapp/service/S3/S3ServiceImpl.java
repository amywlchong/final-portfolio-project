package com.amychong.tourmanagementapp.service.S3;

import com.amychong.tourmanagementapp.exception.S3OperationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class S3ServiceImpl implements S3Service {

  private final S3Client s3;
  private final String bucketName;

  @Autowired
  public S3ServiceImpl(S3Client s3, @Value("${aws.s3.bucketName}") String bucketName) {
    this.s3 = s3;
    this.bucketName = bucketName;
  }

  @Override
  public byte[] getObject(String key) {
    GetObjectRequest getObjectRequest =
        GetObjectRequest.builder().bucket(bucketName).key(key).build();

    ResponseInputStream<GetObjectResponse> res = s3.getObject(getObjectRequest);

    try {
      return res.readAllBytes();
    } catch (IOException e) {
      throw new S3OperationException("Failed to read the object bytes from S3", e);
    }
  }

  @Override
  public void putObject(String key, byte[] file) {
    PutObjectRequest objectRequest = PutObjectRequest.builder().bucket(bucketName).key(key).build();
    s3.putObject(objectRequest, RequestBody.fromBytes(file));
  }

  @Override
  public void deleteObject(String key) {
    DeleteObjectRequest objectRequest =
        DeleteObjectRequest.builder().bucket(bucketName).key(key).build();
    s3.deleteObject(objectRequest);
  }

  @Override
  public void deleteObjects(List<String> keys) {
    List<ObjectIdentifier> objectIds =
        keys.stream()
            .map(key -> ObjectIdentifier.builder().key(key).build())
            .collect(Collectors.toList());

    Delete del = Delete.builder().objects(objectIds).build();

    DeleteObjectsRequest multiObjectDeleteRequest =
        DeleteObjectsRequest.builder().bucket(bucketName).delete(del).build();

    s3.deleteObjects(multiObjectDeleteRequest);
  }
}
