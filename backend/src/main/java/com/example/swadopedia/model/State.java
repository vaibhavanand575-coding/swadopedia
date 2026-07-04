package com.example.swadopedia.model;

import java.util.List;

public class State {
    private String id;
    private String name;
    private String region;
    private String tagline;
    private String imageUrl;
    private List<Dish> dishes;

    public State() {}

    public State(String id, String name, String region, String tagline, String imageUrl, List<Dish> dishes) {
        this.id = id;
        this.name = name;
        this.region = region;
        this.tagline = tagline;
        this.imageUrl = imageUrl;
        this.dishes = dishes;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public List<Dish> getDishes() { return dishes; }
    public void setDishes(List<Dish> dishes) { this.dishes = dishes; }
}
