package com.amychong.tourmanagementapp.entity.tour;

import com.amychong.tourmanagementapp.entity.interfaces.DeepCopyable;
import com.amychong.tourmanagementapp.entity.interfaces.Identifiable;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.apache.commons.lang3.SerializationUtils;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name="tours")
public class Tour implements Identifiable<Integer>, Serializable, DeepCopyable {

    // define fields
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Integer id;

    @NotBlank(message = "Name is required")
    @Size(max = 45, message = "Name should have at most 45 characters")
    @Column(name="name")
    private String name;

    @Positive(message = "Duration must be positive")
    @Column(name="duration")
    private int duration;

    @Positive(message = "Max group size must be positive")
    @Column(name="max_group_size")
    private int maxGroupSize;

    @NotNull(message = "Difficulty is required")
    @Enumerated(EnumType.STRING)
    @Column(name="difficulty")
    private Difficulty difficulty;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be positive")
    @Column(name="price", precision = 10, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "Summary is required")
    @Size(max = 255, message = "Summary should have at most 255 characters")
    @Column(name="summary")
    private String summary;

    @Size(max = 4000, message = "Description should have at most 4000 characters")
    @Column(name="description")
    private String description;

    @NotBlank(message = "Region is required")
    @Size(max = 45, message = "Region should have at most 45 characters")
    @Column(name="region")
    private String region;

    @NotBlank(message = "Start address is required")
    @Size(max = 255, message = "Start address should have at most 255 characters")
    @Column(name="start_address")
    private String startAddress;

    @Column(name="created_date")
    private LocalDate createdDate = LocalDate.now();

    @Column(name="ratings_count")
    private int ratingsCount = 0;

    @DecimalMin(value = "1.0", message = "Average of ratings should be at least 1")
    @DecimalMax(value = "5.0", message = "Average of ratings should be at most 5")
    @Column(name="ratings_average")
    private Float ratingsAverage;

    @OneToMany(mappedBy = "tour", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourImage> tourImages = new ArrayList<>();

    @OneToMany(mappedBy = "tour", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourPointOfInterest> tourPointsOfInterest = new ArrayList<>();

    @OneToMany(mappedBy = "tour", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TourStartDate> tourStartDates = new ArrayList<>();

    // define constructors
    public Tour() {

    }

    public Tour(String name, int duration, int maxGroupSize, Difficulty difficulty, BigDecimal price, String summary, String description, String region, String startAddress, LocalDate createdDate) {
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

    public void setMainFields(Tour theTour) {
        this.name = theTour.getName();
        this.duration = theTour.getDuration();
        this.maxGroupSize = theTour.getMaxGroupSize();
        this.difficulty = theTour.getDifficulty();
        this.price = theTour.getPrice();
        this.summary = theTour.getSummary();
        this.description = theTour.getDescription();
        this.region = theTour.getRegion();
        this.startAddress = theTour.getStartAddress();
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

    public List<TourPointOfInterest> getTourPointsOfInterest() {
        return tourPointsOfInterest;
    }

    public void setTourPointsOfInterest(List<TourPointOfInterest> tourPointsOfInterest) {
        this.tourPointsOfInterest = tourPointsOfInterest;
    }

    public void addTourPointOfInterest(TourPointOfInterest tourPointOfInterest) {
        tourPointsOfInterest.add(tourPointOfInterest);
        tourPointOfInterest.setTour(this);
    }

    public void removeTourPointOfInterest(TourPointOfInterest tourPointOfInterest) {
        tourPointsOfInterest.remove(tourPointOfInterest);
        tourPointOfInterest.setTour(null);
    }

    public List<TourStartDate> getTourStartDates() {
        return tourStartDates;
    }

    public void setTourStartDates(List<TourStartDate> tourStartDates) {
        this.tourStartDates = tourStartDates;
    }

    public void addTourStartDate(TourStartDate tourStartDate) {
        tourStartDates.add(tourStartDate);
        tourStartDate.setTour(this);
    }

    public void removeTourStartDate(TourStartDate tourStartDate) {
        tourStartDates.remove(tourStartDate);
        tourStartDate.setTour(null);
    }

    // deepCopy method
    public Tour deepCopy() {
        return SerializationUtils.clone(this);
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
                ", tourPointsOfInterest=" + tourPointsOfInterest +
                ", tourStartDates=" + tourStartDates +
                '}';
    }

    // define equals and hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Tour tour = (Tour) o;
        return Objects.equals(id, tour.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
