# Corn Yield Estimate App (CYEV2)

## Objective
The **Corn Yield Estimate App** is a web-based tool designed to help farmers, agronomists, and field scouts accurately estimate corn yields before harvest. By inputting specific field measurements and selecting corn hybrid varieties, users can obtain immediate yield estimates to aid in planning and management decisions.

## How It Works

This application calculates the yield potential based on several agronomic factors. The process is as follows:

1.  **Input Data**: The user provides key field observations:
    *   **Grower Info**: Name and Location (Zone).
    *   **Hybrid Selection**: Choosing the specific corn hybrid automatically applies the correct **Yield Recovery Factor** and **Kernels per Kg** settings specific to that variety.
    *   **Field Measurements**:
        *   Row Spacing (cm)
        *   Ears count in 4 meters
        *   Kernels per Ear
        *   Female Area Ratio (e.g., 3:1, 4:1)
        *   Uniform Factor (Field completeness percentage)
        *   Standing Area (Total area in Rai)

2.  **Calculation Logic**:
    The app processes these inputs using a yield estimation formula:
    *   It calculates the plant population per rai.
    *   It determines the yield (kg/rai) by factoring in the specific kernel weight and recovery factor of the selected hybrid.
    *   `Yield Estimate = (Population * Kernels/Ear * Uniformity) / (Kernels/Kg * RecoveryFactor)`

3.  **Results & Data Collection**:
    *   Displays the estimated **Population (plants/rai)**, **Yield (kg/rai)**, and **Total Wet Ear (kg)**.
    *   Automatically submits the collected data to a centralized Google Sheet (via Google Apps Script) for record-keeping and analysis.

## License

**Copyright © Popporn Yingthongchai**

All rights reserved. This software is proprietary and created for specific agricultural use cases.