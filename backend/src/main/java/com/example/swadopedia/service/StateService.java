package com.example.swadopedia.service;

import com.example.swadopedia.model.Dish;
import com.example.swadopedia.model.State;
import com.example.swadopedia.model.StateSummary;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class StateService {

    private final Map<String, State> states = new ConcurrentHashMap<>();

    // Wikimedia Commons thumbnail redirect — permanent URL
    private static final String WC = "https://commons.wikimedia.org/wiki/Special:FilePath/";

    public StateService() { seed(); }

    public List<StateSummary> findAllSummaries() {
        return states.values().stream()
                .map(s -> new StateSummary(s.getId(), s.getName(), s.getRegion(),
                        s.getTagline(), s.getImageUrl(), s.getDishes().size()))
                .collect(Collectors.toList());
    }

    public Optional<State> findById(String id) {
        return Optional.ofNullable(states.get(id));
    }

    private void add(State state) { states.put(state.getId(), state); }

    private Dish dish(String id, String name, String desc, String file, String spice) {
        return new Dish(id, name, desc, WC + file + "?width=400", spice);
    }
    private String stateImg(String file) { return WC + file + "?width=600"; }

    private void seed() {

        // ── PUNJAB ────────────────────────────────────────
        add(new State("punjab", "Punjab", "North",
            "Butter, wheat, and tandoor smoke.",
            stateImg("Golden_Temple,Amritsar.JPG"),                           // ✓ verified
            List.of(
                dish("punjab-1", "Butter chicken",
                    "Tandoori chicken simmered in a rich tomato-butter gravy.",
                    "Chicken_makhani.jpg", "Mild"),                            // ✓ verified
                dish("punjab-2", "Sarson da saag",
                    "Slow-cooked mustard greens served with makki di roti.",
                    "Sarson_Da_Saag_and_Makki_Di_Roti.jpg", "Mild"),
                dish("punjab-3", "Amritsari kulcha",
                    "Stuffed leavened flatbread, crisped on a tandoor wall.",
                    "Amritsari_Kulcha.jpg", "Mild")
            )));

        // ── GUJARAT ───────────────────────────────────────
        add(new State("gujarat", "Gujarat", "West",
            "Sweet, tangy, and endlessly vegetarian.",
            stateImg("Rani_ki_vav_02.jpg"),                                   // ✓ loaded
            List.of(
                dish("gujarat-1", "Dhokla",
                    "Steamed, spongy fermented gram-flour cakes with mustard tempering.",
                    "Khaman_dhokla.jpg", "Mild"),                              // ✓ verified
                dish("gujarat-2", "Undhiyu",
                    "Mixed winter vegetable medley slow-cooked with fenugreek dumplings.",
                    "Undhiyu.jpg", "Medium"),
                dish("gujarat-3", "Thepla",
                    "Spiced flatbread made with fenugreek leaves and whole wheat.",
                    "Thepla.jpg", "Mild")
            )));

        // ── WEST BENGAL ───────────────────────────────────
        add(new State("west-bengal", "West Bengal", "East",
            "Fish, mustard oil, and sweets built on milk.",
            stateImg("Victoria_Memorial_Kolkata_panorama.jpg"),               // ✓ loaded
            List.of(
                dish("bengal-1", "Macher jhol",
                    "Light, turmeric-forward fish curry simmered with potatoes.",
                    "Macher_Jhol.JPG", "Mild"),
                dish("bengal-2", "Shorshe ilish",
                    "Hilsa fish cooked in a pungent mustard-seed paste.",
                    "Shorshe_Ilish.jpg", "Medium"),
                dish("bengal-3", "Rosogolla",
                    "Spongy cheese balls soaked in light sugar syrup.",
                    "Rasgulla.jpg", "None")
            )));

        // ── TELANGANA ─────────────────────────────────────
        add(new State("telangana", "Telangana", "South",
            "Home of the dum-cooked biryani.",
            stateImg("Charminar_Hyderabad_1.jpg"),                            // ✓ loaded
            List.of(
                dish("telangana-1", "Hyderabadi biryani",
                    "Layered basmati rice and marinated meat, slow-cooked dum style.",
                    "Hyderabadi_Chicken_Dum_Biryani.jpg", "Medium"),
                dish("telangana-2", "Mirchi ka salan",
                    "Peanut and sesame gravy built around whole green chillies.",
                    "Mirchi_Ka_Salan.jpg", "Hot"),
                dish("telangana-3", "Double ka meetha",
                    "Bread pudding fried golden and soaked in saffron milk.",
                    "Double_ka_meetha.jpg", "None")
            )));

        // ── KERALA ────────────────────────────────────────
        add(new State("kerala", "Kerala", "South",
            "Coconut, curry leaves, and backwater seafood.",
            stateImg("Chinese_fishing_net_in_Kochi.jpg"),                     // ✓ verified
            List.of(
                dish("kerala-1", "Appam with stew",
                    "Lacy rice-and-coconut pancakes with a mild coconut-milk vegetable stew.",
                    "Appam.jpg", "Mild"),
                dish("kerala-2", "Fish moilee",
                    "Coconut-milk fish curry gently spiced with turmeric and ginger.",
                    "Meen_moilee.jpg", "Mild"),
                dish("kerala-3", "Puttu and kadala",
                    "Steamed rice-flour cylinders served with spiced black chickpeas.",
                    "Puttu_and_Kadala_curry.jpg", "Mild")
            )));

        // ── RAJASTHAN ─────────────────────────────────────
        add(new State("rajasthan", "Rajasthan", "North",
            "Desert-hardy, ghee-rich, built to last.",
            stateImg("Hawa_Mahal_-_Jaipur_-_Rajasthan_-_001.jpg"),            // ✓ verified
            List.of(
                dish("rajasthan-1", "Dal baati churma",
                    "Baked wheat rolls with spiced lentils and sweet crumbled churma.",
                    "Dal_bati.jpg", "Medium"),
                dish("rajasthan-2", "Laal maas",
                    "Fiery mutton curry built on whole dried red chillies.",
                    "Laal_maas.jpg", "Hot"),
                dish("rajasthan-3", "Ghevar",
                    "Disc-shaped, honeycombed sweet soaked in sugar syrup.",
                    "Ghevar.jpg", "None")
            )));

        // ── TAMIL NADU ────────────────────────────────────
        add(new State("tamil-nadu", "Tamil Nadu", "South",
            "Tamarind, curry leaves, and temple-town classics.",
            stateImg("Meenakshi_Amman_Temple,_Madurai.JPG"),                     // ✓ verified
            List.of(
                dish("tamilnadu-1", "Chettinad chicken",
                    "Fiery, aromatic chicken curry with a roasted spice blend.",
                    "Chettinad_Chicken.JPG", "Hot"),
                dish("tamilnadu-2", "Sambar",
                    "Tangy lentil stew with vegetables and tamarind.",
                    "Sambar_(dish).jpg", "Medium"),
                dish("tamilnadu-3", "Filter coffee",
                    "Strong decoction coffee blended with frothed milk.",
                    "Indian_filter_coffee.jpg", "None")
            )));

        // ── MAHARASHTRA ───────────────────────────────────
        add(new State("maharashtra", "Maharashtra", "West",
            "Coastal heat meets Deccan comfort food.",
            stateImg("Gateway_of_India_at_night.jpg"),
            List.of(
                dish("maharashtra-1", "Misal pav",
                    "Spiced sprouted-moth-bean curry topped with farsan, served with pav.",
                    "Misal_Pav_from_Pune.jpg", "Hot"),
                dish("maharashtra-2", "Puran poli",
                    "Sweet flatbread stuffed with jaggery and split-pea filling.",
                    "Puran_poli.JPG", "None"),
                dish("maharashtra-3", "Vada pav",
                    "Spiced potato fritter in a bun with garlic chutney.",
                    "Vada_Pav.jpg", "Medium")                                 // ✓ verified
            )));

        // ── UTTAR PRADESH ─────────────────────────────────
        add(new State("uttar-pradesh", "Uttar Pradesh", "North",
            "Mughal-era kitchens and Ganges-side sweets.",
            stateImg("Taj_Mahal,_Agra,_India_edit3.jpg"),                     // ✓ loaded
            List.of(
                dish("up-1", "Lucknowi kebab",
                    "Melt-in-the-mouth minced meat kebabs finished on charcoal.",
                    "Galouti_kebab.jpg", "Medium"),
                dish("up-2", "Kadhi chawal",
                    "Yogurt-gram flour curry with fritters, served over rice.",
                    "Kadhi_Pakora.jpg", "Mild"),
                dish("up-3", "Petha",
                    "Translucent candied ash gourd, an Agra specialty.",
                    "Agra_Petha.jpg", "None")
            )));

        // ── GOA ───────────────────────────────────────────
        add(new State("goa", "Goa", "West",
            "Portuguese spice trade meets coastal Konkan cooking.",
            stateImg("Candolim_Beach_Goa.jpg"),                                 // ✓ verified
            List.of(
                dish("goa-1", "Fish curry rice",
                    "Coconut and kokum fish curry, the daily staple.",
                    "Goan_fish_curry_rice.jpg", "Medium"),
                dish("goa-2", "Vindaloo",
                    "Vinegar-and-chilli marinated pork, slow braised.",
                    "Pork_vindaloo.jpg", "Hot"),
                dish("goa-3", "Bebinca",
                    "Layered coconut-milk and jaggery Goan-Portuguese pudding.",
                    "Bebinca.jpg", "None")
            )));

        // ── BIHAR ─────────────────────────────────────────
        add(new State("bihar", "Bihar", "East",
            "Sattu-powered, rustic, and rooted in the Gangetic plain.",
            stateImg("Mahabodhi_temple.jpg"),                                 // ✓ loaded
            List.of(
                dish("bihar-1", "Litti chokha",
                    "Roasted wheat-dough balls stuffed with sattu, served with mashed vegetables.",
                    "Litti_Chokha.jpg", "Medium"),
                dish("bihar-2", "Sattu paratha",
                    "Flatbread stuffed with spiced roasted gram flour, pan-fried in ghee.",
                    "Sattu_Paratha.jpg", "Mild"),
                dish("bihar-3", "Thekua",
                    "Deep-fried sweet biscuit made from wheat flour, jaggery, and ghee.",
                    "Thekua.jpg", "None")
            )));

        // ── MADHYA PRADESH ────────────────────────────────
        add(new State("madhya-pradesh", "Madhya Pradesh", "Central",
            "The heart of India — hearty, wheat-belt comfort food.",
            stateImg("Sanchi_Stupa_from_Eastern_gate,_Madhya_Pradesh.jpg"),    // ✓ verified
            List.of(
                dish("mp-1", "Poha",
                    "Flattened rice tempered with mustard seeds, peanuts, and turmeric.",
                    "Poha_(Flattened_Rice).jpg", "Mild"),
                dish("mp-2", "Dal bafla",
                    "Baked wheat dumplings dunked in ghee, served with dal and churma.",
                    "Dal_bafla.jpg", "Medium"),
                dish("mp-3", "Bhutte ka kees",
                    "Grated corn cooked with milk, spices, and coconut — an Indori street classic.",
                    "Bhutte_ka_Kees.jpg", "Mild")
            )));
    }
}
