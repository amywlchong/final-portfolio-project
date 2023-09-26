package com.amychong.tourmanagementapp.dto.tour;

import com.amychong.tourmanagementapp.entity.tour.Difficulty;
import com.amychong.tourmanagementapp.entity.tour.TourPointOfInterest;
import com.amychong.tourmanagementapp.entity.tour.TourStartDate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class TourResponseDTO {

    private Integer id;

    private String name;

    private int duration;

    private int maxGroupSize;

    private Difficulty difficulty;

    private BigDecimal price;

    private String summary;

    private String description;

    private String region;

    private String startAddress;

    private LocalDate createdDate;

    private int ratingsCount;

    private Float ratingsAverage;

    private List<TourImageResponseDTO> tourImages;

    private List<TourPointOfInterest> tourPointsOfInterest;

    private List<TourStartDate> tourStartDates;

    public TourResponseDTO() {
    }

    public TourResponseDTO(Integer id, String name, int duration, int maxGroupSize, Difficulty difficulty, BigDecimal price, String summary, String description, String region, String startAddress, LocalDate createdDate, int ratingsCount, Float ratingsAverage, List<TourImageResponseDTO> tourImages, List<TourPointOfInterest> tourPointsOfInterest, List<TourStartDate> tourStartDates) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.maxGroupSize = maxGroupSize;
        this.difficulty = difficulty;
        this.price = price;
        this.summary = summary;
        this.description = description;
        this.region = region;
        this.startAddress = startAddress;
        this.createdDate = createdDate;
        this.ratingsCount = ratingsCount;
        this.ratingsAverage = ratingsAverage;
        this.tourImages = tourImages;
        this.tourPointsOfInterest = tourPointsOfInterest;
        this.tourStartDates = tourStartDates;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public int getMaxGroupSize() {
        return maxGroupSize;
    }

    public void setMaxGroupSize(int maxGroupSize) {
        this.maxGroupSize = maxGroupSize;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getStartAddress() {
        return startAddress;
    }

    public void setStartAddress(String startAddress) {
        this.startAddress = startAddress;
    }

    public LocalDate getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }

    public int getRatingsCount() {
        return ratingsCount;
    }

    public void setRatingsCount(int ratingsCount) {
        this.ratingsCount = ratingsCount;
    }

    public Float getRatingsAverage() {
        return ratingsAverage;
    }

    public void setRatingsAverage(Float ratingsAverage) {
        this.ratingsAverage = ratingsAverage;
    }

    public List<TourImageResponseDTO> getTourImages() {
        return tourImages;
    }

    public void setTourImages(List<TourImageResponseDTO> tourImages) {
        this.tourImages = tourImages;
    }

    public List<TourPointOfInterest> getTourPointsOfInterest() {
        return tourPointsOfInterest;
    }

    public void setTourPointsOfInterest(List<TourPointOfInterest> tourPointsOfInterest) {
        this.tourPointsOfInterest = tourPointsOfInterest;
    }

    public List<TourStartDate> getTourStartDates() {
        return tourStartDates;
    }

    public void setTourStartDates(List<TourStartDate> tourStartDates) {
        this.tourStartDates = tourStartDates;
    }

    @Override
    public String toString() {
        return "TourResponseDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", duration=" + duration +
                ", maxGroupSize=" + maxGroupSize +
                ", difficulty=" + difficulty +
                ", price=" + price +
                ", summary='" + summary + '\'' +
                ", description='" + description + '\'' +
                ", region='" + region + '\'' +
                ", startAddress='" + startAddress + '\'' +
                ", createdDate=" + createdDate +
                ", ratingsCount=" + ratingsCount +
                ", ratingsAverage=" + ratingsAverage +
                ", tourImages=" + tourImages +
                ", tourPointsOfInterest=" + tourPointsOfInterest +
                ", tourStartDates=" + tourStartDates +
                '}';
    }
}
