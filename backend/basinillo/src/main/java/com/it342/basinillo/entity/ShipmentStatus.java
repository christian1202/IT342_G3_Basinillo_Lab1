package com.it342.basinillo.entity;

/**
 * The 5-stage shipment lifecycle as defined by Philippine customs brokerage.
 *
 * Every shipment progresses through these stages sequentially:
 *
 *   ARRIVED  — Vessel has docked; broker receives BL, CI, Packing List.
 *   LODGED   — Import entry filed with the Bureau of Customs (BOC).
 *   ASSESSED — BOC reviews the entry; assigns lane (Green/Yellow/Red).
 *   PAID     — Duties and taxes have been paid via authorized bank.
 *   RELEASED — Gate Pass issued; container cleared for pickup.
 */
public enum ShipmentStatus {
    ARRIVED,
    LODGED,
    ASSESSED,
    PAID,
    RELEASED
}
