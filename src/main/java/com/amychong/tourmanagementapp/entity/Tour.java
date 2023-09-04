package com.amychong.tourmanagementapp.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name="tours")
public class Tour implements Identifiable<Integer> {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @Column(name="name")
    private String name;

    @Column(name="duration")
    private int duration;

    @Column(name="max_group_size")
    private int maxGroupSize;

    @Enumerated(EnumType.STRING)
    @Column(name="difficulty")
    private Difficulty difficulty;

    @Column(name="price")
    private float price;

    @Column(name="summary")
    private String summary;

    @Column(name="description")
    private String description;

    @Column(name="region")
    private String region;

    @Column(name="start_address")
    private String startAddress;

    @Column(name="created_date")
    private LocalDate createdDate = LocalDate.now();

    @Column(name="ratings_count")
    private int ratingsCount = 0;

    @Column(name="ratings_average")
    private Float ratingsAverage;

    @OneToMany(mappedBy = "tour", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourImage> tourImages = new ArrayList<>();

    // define constructors
    public Tour() {

    }

    public Tour(String name, int duration, int maxGroupSize, Difficulty difficulty, float price, String summary, String description, String region, String startAddress, LocalDate createdDate, int ratingsCount, Float ratingsAverage) {
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
    }

    // define getters and setters

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

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
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

    public List<TourImage> getTourImages() {
        return tourImages;
    }

    public void setTourImages(List<TourImage> tourImages) {
        this.tourImages = tourImages;
    }

    public void addTourImage(TourImage image) {
        tourImages.add(image);
        image.setTour(this);
    }

    public void removeTourImage(TourImage image) {
        tourImages.remove(image);
        image.setTour(null);
    }

    // define toString method
    @Override
    public String toString() {
        return "Tour{" +
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
                '}';
    }

    // define enum
    private enum Difficulty {
        easy, medium, difficult
    }
}
