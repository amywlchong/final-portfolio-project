package com.amychong.tourmanagementapp.dto.tour;

public class TourImageResponseDTO {

  private Integer imageId;

  private String imageName;

  private String imagePath;

  private boolean isCoverImage;

  public TourImageResponseDTO() {}

  public TourImageResponseDTO(
      Integer imageId, String imageName, String imagePath, boolean isCoverImage) {
    this.imageId = imageId;
    this.imageName = imageName;
    this.imagePath = imagePath;
    this.isCoverImage = isCoverImage;
  }

  public Integer getImageId() {
    return imageId;
  }

  public void setImageId(Integer imageId) {
    this.imageId = imageId;
  }

  public String getImageName() {
    return imageName;
  }

  public void setImageName(String imageName) {
    this.imageName = imageName;
  }

  public String getImagePath() {
    return imagePath;
  }

  public void setImagePath(String imagePath) {
    this.imagePath = imagePath;
  }

  public boolean isCoverImage() {
    return isCoverImage;
  }

  public void setCoverImage(boolean coverImage) {
    isCoverImage = coverImage;
  }

  @Override
  public String toString() {
    return "TourImageResponseDTO{"
        + "imageId="
        + imageId
        + ", imageName='"
        + imageName
        + '\''
        + ", imagePath='"
        + imagePath
        + '\''
        + ", isCoverImage="
        + isCoverImage
        + '}';
  }
}
