package com.example.swadopedia.controller;

import com.example.swadopedia.model.State;
import com.example.swadopedia.model.StateSummary;
import com.example.swadopedia.service.StateService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/states")
public class StateController {

    private final StateService stateService;

    public StateController(StateService stateService) {
        this.stateService = stateService;
    }

    @GetMapping
    public List<StateSummary> getAll() {
        return stateService.findAllSummaries();
    }

    @GetMapping("/{id}")
    public State getOne(@PathVariable String id) {
        return stateService.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "State not found"));
    }
}
