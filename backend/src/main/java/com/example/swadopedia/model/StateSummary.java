package com.example.swadopedia.model;

// Lightweight view of a State without the full dish list - used for the state grid/tiles
public class StateSummary {
    private String id;
    private String name;
    private String region;
    private String tagline;
    private String imageUrl;
    private int dishCount;

    public StateSummary(String id, String name, String region, String tagline, String imageUrl, int dishCount) {
        this.id = id;
        this.name = name;
        this.region = region;
        this.tagline = tagline;
        this.imageUrl = imageUrl;
        this.dishCount = dishCount;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public String getRegion() { return region; }
    public String getTagline() { return tagline; }
    public String getImageUrl() { return imageUrl; }
    public int getDishCount() { return dishCount; }
}
