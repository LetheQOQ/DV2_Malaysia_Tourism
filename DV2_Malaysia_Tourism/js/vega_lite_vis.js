var hotelAorMap = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 850,
    "height": 520,

    "title": {
        "text": "Average Occupancy Rate of Hotels by State, 2024",
        "subtitle": "Source: Tourism Malaysia, Malaysia Tourism Statistics in Brief 2024",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "map/mys_state.json",
        "format": {
            "type": "topojson",
            "feature": "mys_admbnda_adm1_unhcr_20210211"
        }
    },

    "transform": [
        {
            "lookup": "properties.ADM1_EN",
            "from": {
                "data": {
                    "url": "data/hotel_aor_by_state_2024.csv",
                    "format": {"type": "csv"}
                },
                "key": "state",
                "fields": ["aor_2024"]
            }
        },
        {
            "calculate": "toNumber(datum.aor_2024)",
            "as": "aor"
        }
    ],

    "projection": {
        "type": "mercator"
    },

    "mark": {
        "type": "geoshape",
        "stroke": "white",
        "strokeWidth": 0.8
    },

    "encoding": {
        "color": {
            "field": "aor",
            "type": "quantitative",
            "title": "AOR 2024 (%)",
            "scale": {
                "scheme": "tealblues"
            }
        },
        "tooltip": [
            {
                "field": "properties.ADM1_EN",
                "type": "nominal",
                "title": "State"
            },
            {
                "field": "aor",
                "type": "quantitative",
                "title": "AOR 2024 (%)",
                "format": ".1f"
            }
        ]
    }
};

vegaEmbed("#hotel_aor_map", hotelAorMap);

var hotelAorBar = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 750,
    "height": 400,

    "title": {
        "text": "Hotel Occupancy Rate Ranking by State, 2024",
        "subtitle": "Pahang recorded the highest average hotel occupancy rate in 2024",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "data/hotel_aor_by_state_2024.csv",
        "format": {
            "type": "csv"
        }
    },

    "transform": [
        {
            "calculate": "toNumber(datum.aor_2024)",
            "as": "aor"
        }
    ],

    "mark": {
        "type": "bar",
        "cornerRadiusEnd": 3
    },

    "encoding": {
        "x": {
            "field": "aor",
            "type": "quantitative",
            "title": "Average Occupancy Rate (%)"
        },
        "y": {
            "field": "state",
            "type": "nominal",
            "title": "State",
            "sort": "-x"
        },
        "color": {
            "field": "aor",
            "type": "quantitative",
            "legend": null,
            "scale": {
                "scheme": "tealblues"
            }
        },
        "tooltip": [
            {
                "field": "state",
                "type": "nominal",
                "title": "State"
            },
            {
                "field": "aor",
                "type": "quantitative",
                "title": "AOR 2024 (%)",
                "format": ".1f"
            }
        ]
    }
};

vegaEmbed("#hotel_aor_bar", hotelAorBar);

var arrivalCountryLine = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 850,
    "height": 400,

    "title": {
        "text": "Monthly Visitor Arrivals to Malaysia by Source Country",
        "subtitle": "Use the dropdown menu to compare selected visitor markets",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "data/arrivals.csv",
        "format": {
            "type": "csv"
        }
    },

    "params": [
        {
            "name": "selected_country",
            "value": "CHN",
            "bind": {
                "input": "select",
                "options": [
                    "ALL",
                    "SGP",
                    "IDN",
                    "CHN",
                    "THA",
                    "BRN",
                    "IND",
                    "PHL",
                    "KOR",
                    "AUS",
                    "JPN",
                    "GBR",
                    "USA"
                ],
                "name": "Select source country: "
            }
        }
    ],

    "transform": [
        {
            "filter": "datum.country == selected_country"
        },
        {
            "calculate": "toNumber(datum.arrivals)",
            "as": "visitor_arrivals"
        }
    ],

    "mark": {
        "type": "line",
        "point": true
    },

    "encoding": {
        "x": {
    "field": "date",
    "type": "temporal",
    "title": "Month and Year",
    "axis": {
        "format": "%b %Y",
        "labelAngle": -45,
        "tickCount": 10
    }
},
        "y": {
            "field": "visitor_arrivals",
            "type": "quantitative",
            "title": "Visitor Arrivals"
        },
        "tooltip": [
            {
                "field": "date",
                "type": "temporal",
                "title": "Month",
                "format": "%b %Y"
            },
            {
                "field": "country",
                "type": "nominal",
                "title": "Source Country Code"
            },
            {
                "field": "visitor_arrivals",
                "type": "quantitative",
                "title": "Arrivals",
                "format": ","
            }
        ]
    }
};

vegaEmbed("#arrival_country_line", arrivalCountryLine);

var topCountryBar = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 380,
    "height": 350,

    "title": {
        "text": "Top 10 Source Countries, 2024",
        "subtitle": "Based on total visitor arrivals",
        "fontSize": 15,
        "subtitleFontSize": 11
    },

    "data": {
        "url": "data/arrivals.csv",
        "format": {"type": "csv"}
    },

    "transform": [
        {
            "filter": "year(datum.date) == 2024 && datum.country != 'ALL'"
        },
        {
            "calculate": "toNumber(datum.arrivals)",
            "as": "arrivals_num"
        },
        {
            "aggregate": [
                {
                    "op": "sum",
                    "field": "arrivals_num",
                    "as": "total_arrivals"
                }
            ],
            "groupby": ["country"]
        },
        {
            "window": [
                {
                    "op": "rank",
                    "as": "rank"
                }
            ],
            "sort": [
                {
                    "field": "total_arrivals",
                    "order": "descending"
                }
            ]
        },
        {
            "filter": "datum.rank <= 10"
        }
    ],

    "mark": {
        "type": "bar",
        "cornerRadiusEnd": 3
    },

    "encoding": {
        "x": {
            "field": "total_arrivals",
            "type": "quantitative",
            "title": "Total Arrivals",
            "axis": {"format": ".2s"}
        },
        "y": {
            "field": "country",
            "type": "nominal",
            "title": "Source Country Code",
            "sort": "-x"
        },
        "color": {
            "field": "total_arrivals",
            "type": "quantitative",
            "legend": null,
            "scale": {"scheme": "tealblues"}
        },
        "tooltip": [
            {
                "field": "country",
                "type": "nominal",
                "title": "Country Code"
            },
            {
                "field": "total_arrivals",
                "type": "quantitative",
                "title": "Total Arrivals",
                "format": ","
            }
        ]
    }
};

vegaEmbed("#top_country_bar", topCountryBar);

var genderMonthBar = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 380,
    "height": 350,

    "title": {
        "text": "Monthly Arrivals by Gender, 2024",
        "subtitle": "All source countries combined",
        "fontSize": 15,
        "subtitleFontSize": 11
    },

    "data": {
        "url": "data/arrivals.csv",
        "format": {"type": "csv"}
    },

    "transform": [
        {
            "filter": "datum.country == 'ALL' && year(datum.date) == 2024"
        },
        {
            "calculate": "toNumber(datum.arrivals_male)",
            "as": "Male"
        },
        {
            "calculate": "toNumber(datum.arrivals_female)",
            "as": "Female"
        },
        {
            "fold": ["Male", "Female"],
            "as": ["gender", "arrivals"]
        }
    ],

    "mark": "bar",

    "encoding": {
        "x": {
            "field": "date",
            "type": "temporal",
            "title": "Month",
            "axis": {
                "format": "%b",
                "labelAngle": 0
            }
        },
        "y": {
            "field": "arrivals",
            "type": "quantitative",
            "title": "Visitor Arrivals",
            "axis": {"format": ".2s"}
        },
        "color": {
            "field": "gender",
            "type": "nominal",
            "title": "Gender"
        },
        "tooltip": [
            {
                "field": "date",
                "type": "temporal",
                "title": "Month",
                "format": "%b %Y"
            },
            {
                "field": "gender",
                "type": "nominal",
                "title": "Gender"
            },
            {
                "field": "arrivals",
                "type": "quantitative",
                "title": "Arrivals",
                "format": ","
            }
        ]
    }
};

vegaEmbed("#gender_month_bar", genderMonthBar);

var monthlyArrivals2024Bar = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 850,
    "height": 380,

    "title": {
        "text": "Monthly International Visitor Arrivals in 2024",
        "subtitle": "All source countries combined",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "data/arrivals.csv",
        "format": {"type": "csv"}
    },

    "transform": [
        {
            "filter": "datum.country == 'ALL' && year(datum.date) == 2024"
        },
        {
            "calculate": "toNumber(datum.arrivals)",
            "as": "arrivals_num"
        },
        {
            "joinaggregate": [
                {
                    "op": "max",
                    "field": "arrivals_num",
                    "as": "max_arrivals"
                }
            ]
        },
        {
            "calculate": "datum.arrivals_num == datum.max_arrivals ? 'Peak Month' : 'Other Month'",
            "as": "highlight"
        }
    ],

    "mark": {
        "type": "bar",
        "cornerRadiusTopLeft": 3,
        "cornerRadiusTopRight": 3
    },

    "encoding": {
        "x": {
            "field": "date",
            "type": "temporal",
            "title": "Month",
            "axis": {
                "format": "%b",
                "labelAngle": 0
            }
        },
        "y": {
            "field": "arrivals_num",
            "type": "quantitative",
            "title": "Visitor Arrivals",
            "axis": {
                "format": ".2s"
            }
        },
        "color": {
            "field": "highlight",
            "type": "nominal",
            "title": "",
            "scale": {
                "domain": ["Peak Month", "Other Month"],
                "range": ["#1f4e79", "#9ecae1"]
            }
        },
        "tooltip": [
            {
                "field": "date",
                "type": "temporal",
                "title": "Month",
                "format": "%b %Y"
            },
            {
                "field": "arrivals_num",
                "type": "quantitative",
                "title": "Arrivals",
                "format": ","
            },
            {
                "field": "highlight",
                "type": "nominal",
                "title": "Category"
            }
        ]
    }
};

vegaEmbed("#monthly_arrivals_2024_bar", monthlyArrivals2024Bar);

var domesticExpenditureLine = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 400,
    "height": 320,

    "title": {
        "text": "Domestic Tourism Expenditure in Malaysia, 2017–2024",
        "subtitle": "Source: Department of Statistics Malaysia (DOSM)",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "data/domestic_tourism_key_stats.csv",
        "format": {"type": "csv"}
    },

    "transform": [
        {
            "calculate": "toNumber(datum.total_expenditure)",
            "as": "expenditure"
        },
        {
            "calculate": "toNumber(datum.year)",
            "as": "year_num"
        }
    ],

    "mark": {
        "type": "line",
        "point": {
            "filled": true,
            "size": 80
        }
    },

    "encoding": {
        "x": {
            "field": "year_num",
            "type": "ordinal",
            "title": "Year"
        },
        "y": {
            "field": "expenditure",
            "type": "quantitative",
            "title": "Total Expenditure (RM million)",
            "axis": {
                "format": ","
            }
        },
        "color": {
            "value": "#1f4e79"
        },
        "tooltip": [
            {
                "field": "year_num",
                "type": "ordinal",
                "title": "Year"
            },
            {
                "field": "expenditure",
                "type": "quantitative",
                "title": "Total Expenditure (RM million)",
                "format": ","
            }
        ]
    }
};

vegaEmbed("#domestic_expenditure_line", domesticExpenditureLine);

var domesticVisitorsLine = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 400,
    "height": 320,

    "title": {
        "text": "Domestic Visitors in Malaysia, 2017–2024",
        "subtitle": "Source: Department of Statistics Malaysia (DOSM)",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "data/domestic_tourism_key_stats.csv",
        "format": {"type": "csv"}
    },

    "transform": [
        {
            "calculate": "toNumber(datum.domestic_visitors)",
            "as": "visitors"
        },
        {
            "calculate": "toNumber(datum.year)",
            "as": "year_num"
        }
    ],

    "mark": {
        "type": "line",
        "point": {
            "filled": true,
            "size": 80
        }
    },

    "encoding": {
        "x": {
            "field": "year_num",
            "type": "ordinal",
            "title": "Year"
        },
        "y": {
            "field": "visitors",
            "type": "quantitative",
            "title": "Domestic Visitors",
            "axis": {
                "format": ","
            }
        },
        "color": {
            "value": "#287233"
        },
        "tooltip": [
            {
                "field": "year_num",
                "type": "ordinal",
                "title": "Year"
            },
            {
                "field": "visitors",
                "type": "quantitative",
                "title": "Domestic Visitors",
                "format": ","
            }
        ]
    }
};

vegaEmbed("#domestic_visitors_line", domesticVisitorsLine);

var domesticChangeBar = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 850,
    "height": 350,

    "title": {
        "text": "Annual Percentage Change in Domestic Tourism, 2017–2024",
        "subtitle": "Negative growth in 2020–2021 was followed by a strong rebound in 2022",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "data/domestic_tourism_key_stats.csv",
        "format": {"type": "csv"}
    },

    "transform": [
        {
            "calculate": "toNumber(datum.annual_percentage_change)",
            "as": "change"
        },
        {
            "calculate": "toNumber(datum.year)",
            "as": "year_num"
        },
        {
            "calculate": "datum.change >= 0 ? 'Positive change' : 'Negative change'",
            "as": "change_type"
        }
    ],

    "mark": {
        "type": "bar",
        "cornerRadiusTopLeft": 3,
        "cornerRadiusTopRight": 3
    },

    "encoding": {
        "x": {
            "field": "year_num",
            "type": "ordinal",
            "title": "Year"
        },
        "y": {
            "field": "change",
            "type": "quantitative",
            "title": "Annual Percentage Change (%)"
        },
        "color": {
            "field": "change_type",
            "type": "nominal",
            "title": "",
            "scale": {
                "domain": ["Positive change", "Negative change"],
                "range": ["#4CAF50", "#D9534F"]
            }
        },
        "tooltip": [
            {
                "field": "year_num",
                "type": "ordinal",
                "title": "Year"
            },
            {
                "field": "change",
                "type": "quantitative",
                "title": "Annual Percentage Change (%)",
                "format": ".1f"
            },
            {
                "field": "change_type",
                "type": "nominal",
                "title": "Category"
            }
        ]
    }
};

vegaEmbed("#domestic_change_bar", domesticChangeBar);

var hotelGuestsStackedBar = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",

    "width": 850,
    "height": 420,

    "title": {
        "text": "Domestic and Foreign Hotel Guests by State, 2024",
        "subtitle": "Source: Tourism Malaysia, Malaysia Tourism Statistics in Brief 2024",
        "fontSize": 16,
        "subtitleFontSize": 12
    },

    "data": {
        "url": "data/hotel_guests_by_state_2024.csv",
        "format": {"type": "csv"}
    },

    "transform": [
        {
            "calculate": "toNumber(datum.domestic)",
            "as": "Domestic"
        },
        {
            "calculate": "toNumber(datum.foreign)",
            "as": "Foreign"
        },
        {
            "fold": ["Domestic", "Foreign"],
            "as": ["guest_type", "guest_count"]
        }
    ],

    "mark": {
        "type": "bar",
        "cornerRadiusEnd": 2
    },

    "encoding": {
        "x": {
            "field": "guest_count",
            "type": "quantitative",
            "title": "Number of Hotel Guests",
            "axis": {
                "format": ".2s"
            }
        },
        "y": {
            "field": "state",
            "type": "nominal",
            "title": "State",
            "sort": "-x"
        },
        "color": {
            "field": "guest_type",
            "type": "nominal",
            "title": "Guest Type",
            "scale": {
                "domain": ["Domestic", "Foreign"],
                "range": ["#9ecae1", "#1f4e79"]
            }
        },
        "tooltip": [
            {
                "field": "state",
                "type": "nominal",
                "title": "State"
            },
            {
                "field": "guest_type",
                "type": "nominal",
                "title": "Guest Type"
            },
            {
                "field": "guest_count",
                "type": "quantitative",
                "title": "Hotel Guests",
                "format": ","
            }
        ]
    }
};

vegaEmbed("#hotel_guests_stacked_bar", hotelGuestsStackedBar);