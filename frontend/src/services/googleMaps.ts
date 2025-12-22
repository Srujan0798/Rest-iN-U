'use client';

// Google Maps Integration Service
// Handles map initialization, geocoding, places autocomplete, directions, and marker clustering

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const GOOGLE_MAPS_VERSION = 'weekly';

// Types
export interface LatLng {
  lat: number;
  lng: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface PlacePrediction {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  formattedAddress: string;
  location: LatLng;
  viewport?: MapBounds;
  addressComponents: AddressComponent[];
  photos?: string[];
  rating?: number;
  types: string[];
}

export interface AddressComponent {
  longName: string;
  shortName: string;
  types: string[];
}

export interface GeocodingResult {
  placeId: string;
  formattedAddress: string;
  location: LatLng;
  addressComponents: AddressComponent[];
  types: string[];
}

export interface DirectionsResult {
  routes: DirectionRoute[];
  status: string;
}

export interface DirectionRoute {
  summary: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  steps: DirectionStep[];
  bounds: MapBounds;
  polyline: string;
}

export interface DirectionStep {
  instruction: string;
  distance: { text: string; value: number };
  duration: { text: string; value: number };
  startLocation: LatLng;
  endLocation: LatLng;
  travelMode: string;
}

export interface NearbyPlace {
  placeId: string;
  name: string;
  location: LatLng;
  vicinity: string;
  types: string[];
  rating?: number;
  userRatingsTotal?: number;
  openNow?: boolean;
  icon?: string;
  distance?: number;
}

// Singleton for Google Maps script loading
let googleMapsPromise: Promise<typeof google.maps> | null = null;
let isLoading = false;

/**
 * Load Google Maps JavaScript API
 */
export async function loadGoogleMaps(): Promise<typeof google.maps> {
  // Return if already loaded
  if (typeof google !== 'undefined' && google.maps) {
    return google.maps;
  }

  // Return existing promise if loading
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  if (isLoading) {
    // Wait for existing load
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (typeof google !== 'undefined' && google.maps) {
          clearInterval(checkInterval);
          resolve(google.maps);
        }
      }, 100);
    });
  }

  isLoading = true;

  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(google.maps));
      existingScript.addEventListener('error', () =>
        reject(new Error('Failed to load Google Maps'))
      );
      return;
    }

    // Create callback function
    const callbackName = `googleMapsCallback_${Date.now()}`;
    (window as any)[callbackName] = () => {
      isLoading = false;
      delete (window as any)[callbackName];
      resolve(google.maps);
    };

    // Create and append script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry,drawing,visualization&v=${GOOGLE_MAPS_VERSION}&callback=${callbackName}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      isLoading = false;
      delete (window as any)[callbackName];
      reject(new Error('Failed to load Google Maps script'));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Create and initialize a Google Map
 */
export async function createMap(
  container: HTMLElement,
  options: google.maps.MapOptions = {}
): Promise<google.maps.Map> {
  const maps = await loadGoogleMaps();

  const defaultOptions: google.maps.MapOptions = {
    center: { lat: 19.076, lng: 72.8777 }, // Mumbai
    zoom: 12,
    mapTypeControl: true,
    streetViewControl: true,
    fullscreenControl: true,
    zoomControl: true,
    styles: getMapStyles(),
  };

  return new maps.Map(container, { ...defaultOptions, ...options });
}

/**
 * Get custom map styles (Dharma Realty theme)
 */
export function getMapStyles(): google.maps.MapTypeStyle[] {
  return [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e9e9e9' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ color: '#f5f5f5' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#e0e0e0' }],
    },
  ];
}

/**
 * Geocode an address to coordinates
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
  const maps = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const result = results[0];
        resolve({
          placeId: result.place_id,
          formattedAddress: result.formatted_address,
          location: {
            lat: result.geometry.location.lat(),
            lng: result.geometry.location.lng(),
          },
          addressComponents: result.address_components.map((c) => ({
            longName: c.long_name,
            shortName: c.short_name,
            types: c.types,
          })),
          types: result.types,
        });
      } else if (status === 'ZERO_RESULTS') {
        resolve(null);
      } else {
        reject(new Error(`Geocoding failed: ${status}`));
      }
    });
  });
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(location: LatLng): Promise<GeocodingResult | null> {
  const maps = await loadGoogleMaps();
  const geocoder = new maps.Geocoder();

  return new Promise((resolve, reject) => {
    geocoder.geocode({ location }, (results, status) => {
      if (status === 'OK' && results && results.length > 0) {
        const result = results[0];
        resolve({
          placeId: result.place_id,
          formattedAddress: result.formatted_address,
          location,
          addressComponents: result.address_components.map((c) => ({
            longName: c.long_name,
            shortName: c.short_name,
            types: c.types,
          })),
          types: result.types,
        });
      } else if (status === 'ZERO_RESULTS') {
        resolve(null);
      } else {
        reject(new Error(`Reverse geocoding failed: ${status}`));
      }
    });
  });
}

/**
 * Create Places Autocomplete service
 */
export async function createAutocomplete(
  inputElement: HTMLInputElement,
  options: google.maps.places.AutocompleteOptions = {}
): Promise<google.maps.places.Autocomplete> {
  const maps = await loadGoogleMaps();

  const defaultOptions: google.maps.places.AutocompleteOptions = {
    componentRestrictions: { country: 'in' },
    fields: ['place_id', 'geometry', 'formatted_address', 'address_components', 'name'],
    types: ['address'],
  };

  return new maps.places.Autocomplete(inputElement, {
    ...defaultOptions,
    ...options,
  });
}

/**
 * Get place autocomplete predictions
 */
export async function getPlacePredictions(
  input: string,
  sessionToken?: google.maps.places.AutocompleteSessionToken
): Promise<PlacePrediction[]> {
  const maps = await loadGoogleMaps();
  const service = new maps.places.AutocompleteService();

  return new Promise((resolve, reject) => {
    service.getPlacePredictions(
      {
        input,
        componentRestrictions: { country: 'in' },
        sessionToken,
        types: ['geocode', 'establishment'],
      },
      (predictions, status) => {
        if (status === 'OK' && predictions) {
          resolve(
            predictions.map((p) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting.main_text,
              secondaryText: p.structured_formatting.secondary_text || '',
              types: p.types,
            }))
          );
        } else if (status === 'ZERO_RESULTS') {
          resolve([]);
        } else {
          reject(new Error(`Place predictions failed: ${status}`));
        }
      }
    );
  });
}

/**
 * Get place details by place ID
 */
export async function getPlaceDetails(placeId: string): Promise<PlaceDetails | null> {
  const maps = await loadGoogleMaps();

  // Need a map element for PlacesService
  const tempDiv = document.createElement('div');
  const service = new maps.places.PlacesService(tempDiv);

  return new Promise((resolve, reject) => {
    service.getDetails(
      {
        placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'address_components',
          'photos',
          'rating',
          'types',
        ],
      },
      (place, status) => {
        if (status === 'OK' && place) {
          resolve({
            placeId: place.place_id || '',
            name: place.name || '',
            formattedAddress: place.formatted_address || '',
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
            viewport: place.geometry?.viewport
              ? {
                  north: place.geometry.viewport.getNorthEast().lat(),
                  south: place.geometry.viewport.getSouthWest().lat(),
                  east: place.geometry.viewport.getNorthEast().lng(),
                  west: place.geometry.viewport.getSouthWest().lng(),
                }
              : undefined,
            addressComponents: (place.address_components || []).map((c) => ({
              longName: c.long_name,
              shortName: c.short_name,
              types: c.types,
            })),
            photos: place.photos?.slice(0, 5).map((p) => p.getUrl({ maxWidth: 800 })),
            rating: place.rating,
            types: place.types || [],
          });
        } else {
          resolve(null);
        }
      }
    );
  });
}

/**
 * Get directions between two points
 */
export async function getDirections(
  origin: LatLng | string,
  destination: LatLng | string,
  travelMode: google.maps.TravelMode = google.maps.TravelMode.DRIVING
): Promise<DirectionsResult> {
  const maps = await loadGoogleMaps();
  const directionsService = new maps.DirectionsService();

  return new Promise((resolve, reject) => {
    directionsService.route(
      {
        origin,
        destination,
        travelMode,
        provideRouteAlternatives: true,
      },
      (result, status) => {
        if (status === 'OK' && result) {
          resolve({
            routes: result.routes.map((route) => ({
              summary: route.summary || '',
              distance: {
                text: route.legs[0].distance?.text || '',
                value: route.legs[0].distance?.value || 0,
              },
              duration: {
                text: route.legs[0].duration?.text || '',
                value: route.legs[0].duration?.value || 0,
              },
              steps: route.legs[0].steps.map((step) => ({
                instruction: step.instructions,
                distance: {
                  text: step.distance?.text || '',
                  value: step.distance?.value || 0,
                },
                duration: {
                  text: step.duration?.text || '',
                  value: step.duration?.value || 0,
                },
                startLocation: {
                  lat: step.start_location.lat(),
                  lng: step.start_location.lng(),
                },
                endLocation: {
                  lat: step.end_location.lat(),
                  lng: step.end_location.lng(),
                },
                travelMode: step.travel_mode,
              })),
              bounds: {
                north: route.bounds.getNorthEast().lat(),
                south: route.bounds.getSouthWest().lat(),
                east: route.bounds.getNorthEast().lng(),
                west: route.bounds.getSouthWest().lng(),
              },
              polyline: route.overview_polyline,
            })),
            status: 'OK',
          });
        } else {
          reject(new Error(`Directions failed: ${status}`));
        }
      }
    );
  });
}

/**
 * Search for nearby places
 */
export async function searchNearby(
  location: LatLng,
  radius: number = 1000,
  type?: string
): Promise<NearbyPlace[]> {
  const maps = await loadGoogleMaps();

  const tempDiv = document.createElement('div');
  const service = new maps.places.PlacesService(tempDiv);

  const request: google.maps.places.PlaceSearchRequest = {
    location: new maps.LatLng(location.lat, location.lng),
    radius,
    type: type as string,
  };

  return new Promise((resolve, reject) => {
    service.nearbySearch(request, (results, status) => {
      if (status === 'OK' && results) {
        resolve(
          results.map((place) => ({
            placeId: place.place_id || '',
            name: place.name || '',
            location: {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            },
            vicinity: place.vicinity || '',
            types: place.types || [],
            rating: place.rating,
            userRatingsTotal: place.user_ratings_total,
            openNow: place.opening_hours?.isOpen(),
            icon: place.icon,
            distance: calculateDistance(location, {
              lat: place.geometry?.location?.lat() || 0,
              lng: place.geometry?.location?.lng() || 0,
            }),
          }))
        );
      } else if (status === 'ZERO_RESULTS') {
        resolve([]);
      } else {
        reject(new Error(`Nearby search failed: ${status}`));
      }
    });
  });
}

/**
 * Calculate distance between two points (in meters)
 */
export function calculateDistance(point1: LatLng, point2: LatLng): number {
  const R = 6371e3; // Earth's radius in meters
  const Ï†1 = (point1.lat * Math.PI) / 180;
  const Ï†2 = (point2.lat * Math.PI) / 180;
  const Î”Ï† = ((point2.lat - point1.lat) * Math.PI) / 180;
  const Î”Î» = ((point2.lng - point1.lng) * Math.PI) / 180;

  const a =
    Math.sin(Î”Ï† / 2) * Math.sin(Î”Ï† / 2) +
    Math.cos(Ï†1) * Math.cos(Ï†2) * Math.sin(Î”Î» / 2) * Math.sin(Î”Î» / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

/**
 * Create a marker with custom styling
 */
export async function createPropertyMarker(
  map: google.maps.Map,
  position: LatLng,
  options: {
    price?: string;
    vastuScore?: number;
    isSelected?: boolean;
    onClick?: () => void;
  } = {}
): Promise<google.maps.Marker> {
  const maps = await loadGoogleMaps();

  const { price, vastuScore, isSelected, onClick } = options;

  // Custom marker icon using SVG
  const markerColor = vastuScore
    ? vastuScore >= 80
      ? '#10B981'
      : vastuScore >= 60
      ? '#F59E0B'
      : '#EF4444'
    : '#F97316';

  const marker = new maps.Marker({
    map,
    position,
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: isSelected ? 12 : 10,
      fillColor: markerColor,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
    },
    label: price
      ? {
          text: price,
          color: '#ffffff',
          fontSize: '11px',
          fontWeight: 'bold',
        }
      : undefined,
    animation: isSelected ? maps.Animation.BOUNCE : undefined,
  });

  if (onClick) {
    marker.addListener('click', onClick);
  }

  return marker;
}

/**
 * Create drawing manager for area search
 */
export async function createDrawingManager(
  map: google.maps.Map,
  onComplete: (shape: google.maps.Polygon | google.maps.Circle) => void
): Promise<google.maps.drawing.DrawingManager> {
  const maps = await loadGoogleMaps();

  const drawingManager = new maps.drawing.DrawingManager({
    drawingMode: null,
    drawingControl: true,
    drawingControlOptions: {
      position: maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        maps.drawing.OverlayType.POLYGON,
        maps.drawing.OverlayType.CIRCLE,
      ],
    },
    polygonOptions: {
      fillColor: '#F97316',
      fillOpacity: 0.2,
      strokeColor: '#F97316',
      strokeWeight: 2,
      editable: true,
      draggable: true,
    },
    circleOptions: {
      fillColor: '#F97316',
      fillOpacity: 0.2,
      strokeColor: '#F97316',
      strokeWeight: 2,
      editable: true,
      draggable: true,
    },
  });

  drawingManager.setMap(map);

  maps.event.addListener(drawingManager, 'overlaycomplete', (event: any) => {
    drawingManager.setDrawingMode(null);
    onComplete(event.overlay);
  });

  return drawingManager;
}

/**
 * Create marker clusterer for multiple properties
 */
export async function createMarkerClusterer(
  map: google.maps.Map,
  markers: google.maps.Marker[]
): Promise<any> {
  // Note: MarkerClusterer needs to be loaded separately
  // This is a placeholder - in production, use @googlemaps/markerclusterer
  console.log('Marker clustering would be implemented with @googlemaps/markerclusterer');
  return null;
}

/**
 * Create info window for property details
 */
export async function createInfoWindow(
  content: string | HTMLElement
): Promise<google.maps.InfoWindow> {
  const maps = await loadGoogleMaps();
  return new maps.InfoWindow({ content });
}

/**
 * Get static map URL for property thumbnails
 */
export function getStaticMapUrl(
  location: LatLng,
  options: {
    width?: number;
    height?: number;
    zoom?: number;
    mapType?: 'roadmap' | 'satellite' | 'terrain' | 'hybrid';
  } = {}
): string {
  const { width = 400, height = 200, zoom = 15, mapType = 'roadmap' } = options;

  const params = new URLSearchParams({
    center: `${location.lat},${location.lng}`,
    zoom: zoom.toString(),
    size: `${width}x${height}`,
    maptype: mapType,
    markers: `color:orange|${location.lat},${location.lng}`,
    key: GOOGLE_MAPS_API_KEY,
  });

  return `https://maps.googleapis.com/maps/api/staticmap?${params}`;
}

// Export types
export type { google };
Stripe Â· TS
'use client';

// Stripe Payment Integration Service
// Handles subscription checkout, payment processing, and customer portal

import { loadStripe, Stripe, StripeElements, PaymentIntent } from '@stripe/stripe-js';
import apiClient from '@/services/api';

const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';

// Types
export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  tier: 'basic' | 'premium' | 'professional';
  prices: {
    monthly: { id: string; amount: number; currency: string };
    yearly: { id: string; amount: number; currency: string; savings: number };
  };
  features: string[];
  highlighted?: boolean;
  popular?: boolean;
}

export interface Subscription {
  id: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing';
  planId: string;
  planName: string;
  tier: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  interval: 'month' | 'year';
  amount: number;
  currency: string;
}

export interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  };
  isDefault: boolean;
}

export interface Invoice {
  id: string;
  number: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  amount: number;
  currency: string;
  created: string;
  dueDate?: string;
  pdfUrl?: string;
}

export interface CheckoutSession {
  id: string;
  url: string;
  paymentStatus: string;
}

export interface CreateCheckoutParams {
  planId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
  trialDays?: number;
  couponCode?: string;
}

export interface OneTimePaymentParams {
  amount: number;
  currency?: string;
  description: string;
  metadata?: Record<string, string>;
  successUrl: string;
  cancelUrl: string;
}

// Stripe instance singleton
let stripePromise: Promise<Stripe | null> | null = null;

/**
 * Get or create Stripe instance
 */
export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    if (!STRIPE_PUBLISHABLE_KEY) {
      console.error('Stripe publishable key is not configured');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
}

/**
 * Create subscription checkout session
 */
export async function createSubscriptionCheckout(
  params: CreateCheckoutParams
): Promise<CheckoutSession> {
  const response = await apiClient.post<{
    success: boolean;
    data: CheckoutSession;
    error?: string;
  }>('/payments/checkout/subscription', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create checkout session');
  }

  return response.data.data;
}

/**
 * Create one-time payment checkout session
 */
export async function createOneTimeCheckout(
  params: OneTimePaymentParams
): Promise<CheckoutSession> {
  const response = await apiClient.post<{
    success: boolean;
    data: CheckoutSession;
    error?: string;
  }>('/payments/checkout/one-time', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create checkout session');
  }

  return response.data.data;
}

/**
 * Redirect to Stripe Checkout
 */
export async function redirectToCheckout(sessionId: string): Promise<void> {
  const stripe = await getStripe();
  if (!stripe) {
    throw new Error('Stripe is not initialized');
  }

  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Create customer portal session
 */
export async function createPortalSession(returnUrl: string): Promise<string> {
  const response = await apiClient.post<{
    success: boolean;
    data: { url: string };
    error?: string;
  }>('/payments/portal', { returnUrl });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create portal session');
  }

  return response.data.data.url;
}

/**
 * Get current subscription
 */
export async function getCurrentSubscription(): Promise<Subscription | null> {
  const response = await apiClient.get<{
    success: boolean;
    data: Subscription | null;
    error?: string;
  }>('/subscriptions/current');

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to get subscription');
  }

  return response.data.data;
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  immediately: boolean = false
): Promise<Subscription> {
  const response = await apiClient.post<{
    success: boolean;
    data: Subscription;
    error?: string;
  }>('/subscriptions/cancel', { immediately });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to cancel subscription');
  }

  return response.data.data;
}

/**
 * Resume canceled subscription
 */
export async function resumeSubscription(): Promise<Subscription> {
  const response = await apiClient.post<{
    success: boolean;
    data: Subscription;
    error?: string;
  }>('/subscriptions/resume');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to resume subscription');
  }

  return response.data.data;
}

/**
 * Update subscription plan
 */
export async function updateSubscription(
  newPriceId: string
): Promise<Subscription> {
  const response = await apiClient.post<{
    success: boolean;
    data: Subscription;
    error?: string;
  }>('/subscriptions/update', { priceId: newPriceId });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to update subscription');
  }

  return response.data.data;
}

/**
 * Get subscription plans
 */
export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: SubscriptionPlan[];
    error?: string;
  }>('/subscriptions/plans');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get plans');
  }

  return response.data.data;
}

/**
 * Get payment methods
 */
export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: PaymentMethod[];
    error?: string;
  }>('/payments/methods');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get payment methods');
  }

  return response.data.data;
}

/**
 * Add payment method
 */
export async function addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
  const response = await apiClient.post<{
    success: boolean;
    data: PaymentMethod;
    error?: string;
  }>('/payments/methods', { paymentMethodId });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to add payment method');
  }

  return response.data.data;
}

/**
 * Remove payment method
 */
export async function removePaymentMethod(paymentMethodId: string): Promise<void> {
  const response = await apiClient.delete<{
    success: boolean;
    error?: string;
  }>(`/payments/methods/${paymentMethodId}`);

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to remove payment method');
  }
}

/**
 * Set default payment method
 */
export async function setDefaultPaymentMethod(
  paymentMethodId: string
): Promise<PaymentMethod> {
  const response = await apiClient.post<{
    success: boolean;
    data: PaymentMethod;
    error?: string;
  }>(`/payments/methods/${paymentMethodId}/default`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to set default payment method');
  }

  return response.data.data;
}

/**
 * Get invoices
 */
export async function getInvoices(params?: {
  limit?: number;
  startingAfter?: string;
}): Promise<{ invoices: Invoice[]; hasMore: boolean }> {
  const response = await apiClient.get<{
    success: boolean;
    data: { invoices: Invoice[]; hasMore: boolean };
    error?: string;
  }>('/payments/invoices', { params });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get invoices');
  }

  return response.data.data;
}

/**
 * Apply coupon code
 */
export async function validateCoupon(
  code: string
): Promise<{ valid: boolean; percentOff?: number; amountOff?: number; duration: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { valid: boolean; percentOff?: number; amountOff?: number; duration: string };
    error?: string;
  }>('/payments/coupons/validate', { code });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Invalid coupon code');
  }

  return response.data.data;
}

/**
 * Create payment intent for embedded payment form
 */
export async function createPaymentIntent(params: {
  amount: number;
  currency?: string;
  description?: string;
  metadata?: Record<string, string>;
}): Promise<{ clientSecret: string; paymentIntentId: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { clientSecret: string; paymentIntentId: string };
    error?: string;
  }>('/payments/intent', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create payment intent');
  }

  return response.data.data;
}

/**
 * Confirm payment with client secret
 */
export async function confirmPayment(
  clientSecret: string,
  elements: StripeElements,
  returnUrl: string
): Promise<{ paymentIntent?: PaymentIntent; error?: string }> {
  const stripe = await getStripe();
  if (!stripe) {
    return { error: 'Stripe is not initialized' };
  }

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: returnUrl,
    },
    redirect: 'if_required',
  });

  if (error) {
    return { error: error.message };
  }

  return { paymentIntent };
}

/**
 * Create setup intent for saving payment method
 */
export async function createSetupIntent(): Promise<{ clientSecret: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { clientSecret: string };
    error?: string;
  }>('/payments/setup-intent');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create setup intent');
  }

  return response.data.data;
}

/**
 * Confirm setup intent for saving payment method
 */
export async function confirmSetup(
  clientSecret: string,
  elements: StripeElements
): Promise<{ setupIntent?: any; error?: string }> {
  const stripe = await getStripe();
  if (!stripe) {
    return { error: 'Stripe is not initialized' };
  }

  const { error, setupIntent } = await stripe.confirmSetup({
    elements,
    confirmParams: {
      return_url: window.location.href,
    },
    redirect: 'if_required',
  });

  if (error) {
    return { error: error.message };
  }

  return { setupIntent };
}

// Helper functions

/**
 * Format currency amount for display
 */
export function formatAmount(amount: number, currency: string = 'INR'): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(amount / 100); // Stripe uses cents
}

/**
 * Get card brand icon name
 */
export function getCardBrandIcon(brand: string): string {
  const brandIcons: Record<string, string> = {
    visa: 'visa',
    mastercard: 'mastercard',
    amex: 'amex',
    discover: 'discover',
    jcb: 'jcb',
    diners: 'diners',
    unionpay: 'unionpay',
  };

  return brandIcons[brand.toLowerCase()] || 'generic';
}

/**
 * Format card expiry
 */
export function formatCardExpiry(month: number, year: number): string {
  return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`;
}

/**
 * Check if subscription is active
 */
export function isSubscriptionActive(subscription: Subscription | null): boolean {
  if (!subscription) return false;
  return ['active', 'trialing'].includes(subscription.status);
}

/**
 * Check if subscription has feature
 */
export function hasFeature(
  subscription: Subscription | null,
  feature: string,
  featuresByTier: Record<string, string[]>
): boolean {
  if (!subscription) return false;
  const tierFeatures = featuresByTier[subscription.tier] || [];
  return tierFeatures.includes(feature);
}

/**
 * Get subscription badge color
 */
export function getSubscriptionStatusColor(
  status: Subscription['status']
): string {
  const colors: Record<Subscription['status'], string> = {
    active: 'green',
    trialing: 'blue',
    canceled: 'gray',
    past_due: 'red',
    incomplete: 'yellow',
  };

  return colors[status] || 'gray';
}

// Default subscription plans (fallback)
export const DEFAULT_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals starting their property search',
    tier: 'basic',
    prices: {
      monthly: { id: 'price_basic_monthly', amount: 49900, currency: 'INR' },
      yearly: { id: 'price_basic_yearly', amount: 499900, currency: 'INR', savings: 99 },
    },
    features: [
      'Up to 10 property saves',
      'Basic Vastu analysis',
      'Email alerts for saved searches',
      'Standard support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious buyers and investors',
    tier: 'premium',
    prices: {
      monthly: { id: 'price_premium_monthly', amount: 149900, currency: 'INR' },
      yearly: { id: 'price_premium_yearly', amount: 1499900, currency: 'INR', savings: 299 },
    },
    features: [
      'Unlimited property saves',
      'Detailed Vastu analysis',
      'Climate risk assessment',
      'Priority agent matching',
      'Advanced analytics',
      'Priority support',
    ],
    popular: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For agents and real estate professionals',
    tier: 'professional',
    prices: {
      monthly: { id: 'price_pro_monthly', amount: 299900, currency: 'INR' },
      yearly: { id: 'price_pro_yearly', amount: 2999900, currency: 'INR', savings: 599 },
    },
    features: [
      'Everything in Premium',
      'Agent dashboard',
      'Lead management',
      'Listing analytics',
      'Blockchain verification',
      'API access',
      'Dedicated account manager',
    ],
    highlighted: true,
  },
];

export type {
  Stripe,
  StripeElements,
  PaymentIntent,
};
Docusign Â· TS
'use client';

// DocuSign Integration Service
// Handles document signing workflows, envelope creation, and embedded signing

import apiClient from '@/services/api';

// Types
export interface Signer {
  name: string;
  email: string;
  recipientId: string;
  routingOrder: number;
  roleName?: string;
  tabs?: SignerTabs;
}

export interface SignerTabs {
  signHereTabs?: TabPosition[];
  initialHereTabs?: TabPosition[];
  dateSignedTabs?: TabPosition[];
  textTabs?: TextTab[];
  checkboxTabs?: CheckboxTab[];
}

export interface TabPosition {
  documentId: string;
  pageNumber: number;
  xPosition: string;
  yPosition: string;
  tabLabel?: string;
}

export interface TextTab extends TabPosition {
  name: string;
  value?: string;
  required?: boolean;
  locked?: boolean;
  width?: number;
  height?: number;
}

export interface CheckboxTab extends TabPosition {
  name: string;
  selected?: boolean;
  required?: boolean;
  locked?: boolean;
}

export interface Document {
  documentId: string;
  name: string;
  fileExtension: string;
  documentBase64?: string;
  remoteUrl?: string;
  order?: number;
}

export interface EnvelopeDefinition {
  emailSubject: string;
  emailBlurb?: string;
  documents: Document[];
  recipients: {
    signers: Signer[];
    carbonCopies?: CarbonCopy[];
  };
  status: 'created' | 'sent';
  templateId?: string;
  brandId?: string;
  expiresInDays?: number;
}

export interface CarbonCopy {
  name: string;
  email: string;
  recipientId: string;
  routingOrder: number;
}

export interface Envelope {
  envelopeId: string;
  status: EnvelopeStatus;
  emailSubject: string;
  createdDateTime: string;
  sentDateTime?: string;
  completedDateTime?: string;
  voidedDateTime?: string;
  expiringDateTime?: string;
  recipients: {
    signers: RecipientStatus[];
    carbonCopies?: RecipientStatus[];
  };
  documents?: EnvelopeDocument[];
}

export type EnvelopeStatus =
  | 'created'
  | 'sent'
  | 'delivered'
  | 'signed'
  | 'completed'
  | 'declined'
  | 'voided'
  | 'deleted';

export interface RecipientStatus {
  recipientId: string;
  name: string;
  email: string;
  status: 'created' | 'sent' | 'delivered' | 'signed' | 'completed' | 'declined';
  signedDateTime?: string;
  deliveredDateTime?: string;
  declinedDateTime?: string;
  declinedReason?: string;
}

export interface EnvelopeDocument {
  documentId: string;
  name: string;
  type: string;
  uri: string;
}

export interface EmbeddedSigningUrl {
  url: string;
  email: string;
  recipientId: string;
  expiresAt: string;
}

export interface Template {
  templateId: string;
  name: string;
  description?: string;
  shared: boolean;
  owner: { userName: string; email: string };
  created: string;
  lastModified: string;
  documents: { documentId: string; name: string }[];
  roles: { roleName: string; name?: string; email?: string }[];
}

export interface SigningEventData {
  envelopeId: string;
  recipientId: string;
  event: 'signing_complete' | 'cancel' | 'decline' | 'exception' | 'session_timeout';
  returnUrl?: string;
}

// Real Estate Document Templates
export const DOCUMENT_TEMPLATES = {
  PURCHASE_AGREEMENT: 'purchase_agreement',
  SALE_DEED: 'sale_deed',
  RENTAL_AGREEMENT: 'rental_agreement',
  NOC: 'no_objection_certificate',
  POWER_OF_ATTORNEY: 'power_of_attorney',
  AFFIDAVIT: 'affidavit',
  ENCUMBRANCE_CERTIFICATE: 'encumbrance_certificate',
  POSSESSION_LETTER: 'possession_letter',
} as const;

export type DocumentTemplate = typeof DOCUMENT_TEMPLATES[keyof typeof DOCUMENT_TEMPLATES];

/**
 * Create a new envelope for signing
 */
export async function createEnvelope(
  definition: EnvelopeDefinition
): Promise<{ envelopeId: string; status: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { envelopeId: string; status: string };
    error?: string;
  }>('/docusign/envelopes', definition);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create envelope');
  }

  return response.data.data;
}

/**
 * Create envelope from template
 */
export async function createEnvelopeFromTemplate(params: {
  templateId: string;
  emailSubject: string;
  emailBlurb?: string;
  signers: { roleName: string; name: string; email: string }[];
  customFields?: Record<string, string>;
  status?: 'created' | 'sent';
}): Promise<{ envelopeId: string; status: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { envelopeId: string; status: string };
    error?: string;
  }>('/docusign/envelopes/from-template', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create envelope from template');
  }

  return response.data.data;
}

/**
 * Get envelope by ID
 */
export async function getEnvelope(envelopeId: string): Promise<Envelope> {
  const response = await apiClient.get<{
    success: boolean;
    data: Envelope;
    error?: string;
  }>(`/docusign/envelopes/${envelopeId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get envelope');
  }

  return response.data.data;
}

/**
 * List user's envelopes
 */
export async function listEnvelopes(params?: {
  status?: EnvelopeStatus;
  fromDate?: string;
  toDate?: string;
  searchText?: string;
  count?: number;
  startPosition?: number;
}): Promise<{ envelopes: Envelope[]; totalSetSize: number }> {
  const response = await apiClient.get<{
    success: boolean;
    data: { envelopes: Envelope[]; totalSetSize: number };
    error?: string;
  }>('/docusign/envelopes', { params });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to list envelopes');
  }

  return response.data.data;
}

/**
 * Get embedded signing URL for in-app signing
 */
export async function getEmbeddedSigningUrl(params: {
  envelopeId: string;
  recipientEmail: string;
  recipientName: string;
  returnUrl: string;
  authenticationMethod?: 'none' | 'email' | 'phone' | 'idCheck';
}): Promise<EmbeddedSigningUrl> {
  const response = await apiClient.post<{
    success: boolean;
    data: EmbeddedSigningUrl;
    error?: string;
  }>('/docusign/signing/embedded', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get signing URL');
  }

  return response.data.data;
}

/**
 * Send envelope for signing
 */
export async function sendEnvelope(envelopeId: string): Promise<{ status: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { status: string };
    error?: string;
  }>(`/docusign/envelopes/${envelopeId}/send`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to send envelope');
  }

  return response.data.data;
}

/**
 * Void an envelope
 */
export async function voidEnvelope(
  envelopeId: string,
  voidReason: string
): Promise<{ status: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { status: string };
    error?: string;
  }>(`/docusign/envelopes/${envelopeId}/void`, { voidReason });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to void envelope');
  }

  return response.data.data;
}

/**
 * Resend envelope to recipients
 */
export async function resendEnvelope(envelopeId: string): Promise<void> {
  const response = await apiClient.post<{
    success: boolean;
    error?: string;
  }>(`/docusign/envelopes/${envelopeId}/resend`);

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to resend envelope');
  }
}

/**
 * Download signed document
 */
export async function downloadDocument(
  envelopeId: string,
  documentId: string
): Promise<Blob> {
  const response = await apiClient.get(
    `/docusign/envelopes/${envelopeId}/documents/${documentId}`,
    { responseType: 'blob' }
  );

  return response.data;
}

/**
 * Download combined document (all documents in envelope)
 */
export async function downloadCombinedDocument(envelopeId: string): Promise<Blob> {
  const response = await apiClient.get(
    `/docusign/envelopes/${envelopeId}/documents/combined`,
    { responseType: 'blob' }
  );

  return response.data;
}

/**
 * Download certificate of completion
 */
export async function downloadCertificate(envelopeId: string): Promise<Blob> {
  const response = await apiClient.get(
    `/docusign/envelopes/${envelopeId}/certificate`,
    { responseType: 'blob' }
  );

  return response.data;
}

/**
 * Get available templates
 */
export async function getTemplates(): Promise<Template[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: Template[];
    error?: string;
  }>('/docusign/templates');

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get templates');
  }

  return response.data.data;
}

/**
 * Get template by ID
 */
export async function getTemplate(templateId: string): Promise<Template> {
  const response = await apiClient.get<{
    success: boolean;
    data: Template;
    error?: string;
  }>(`/docusign/templates/${templateId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get template');
  }

  return response.data.data;
}

/**
 * Create property document for signing
 */
export async function createPropertyDocument(params: {
  propertyId: string;
  documentType: DocumentTemplate;
  parties: {
    buyer?: { name: string; email: string };
    seller?: { name: string; email: string };
    agent?: { name: string; email: string };
    witness?: { name: string; email: string };
  };
  documentData: Record<string, any>;
  sendImmediately?: boolean;
}): Promise<{ envelopeId: string; status: string }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { envelopeId: string; status: string };
    error?: string;
  }>('/docusign/property-documents', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create property document');
  }

  return response.data.data;
}

/**
 * Get signing status for property
 */
export async function getPropertySigningStatus(propertyId: string): Promise<{
  pendingDocuments: { envelopeId: string; documentType: string; status: string }[];
  completedDocuments: { envelopeId: string; documentType: string; completedAt: string }[];
}> {
  const response = await apiClient.get<{
    success: boolean;
    data: {
      pendingDocuments: { envelopeId: string; documentType: string; status: string }[];
      completedDocuments: { envelopeId: string; documentType: string; completedAt: string }[];
    };
    error?: string;
  }>(`/docusign/properties/${propertyId}/status`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get signing status');
  }

  return response.data.data;
}

// Helper functions

/**
 * Get status badge color
 */
export function getStatusColor(status: EnvelopeStatus): string {
  const colors: Record<EnvelopeStatus, string> = {
    created: 'gray',
    sent: 'blue',
    delivered: 'yellow',
    signed: 'green',
    completed: 'green',
    declined: 'red',
    voided: 'gray',
    deleted: 'gray',
  };

  return colors[status] || 'gray';
}

/**
 * Get status display text
 */
export function getStatusText(status: EnvelopeStatus): string {
  const texts: Record<EnvelopeStatus, string> = {
    created: 'Draft',
    sent: 'Sent',
    delivered: 'Delivered',
    signed: 'Signed',
    completed: 'Completed',
    declined: 'Declined',
    voided: 'Voided',
    deleted: 'Deleted',
  };

  return texts[status] || status;
}

/**
 * Format document type for display
 */
export function formatDocumentType(type: DocumentTemplate): string {
  const names: Record<DocumentTemplate, string> = {
    purchase_agreement: 'Purchase Agreement',
    sale_deed: 'Sale Deed',
    rental_agreement: 'Rental Agreement',
    no_objection_certificate: 'No Objection Certificate',
    power_of_attorney: 'Power of Attorney',
    affidavit: 'Affidavit',
    encumbrance_certificate: 'Encumbrance Certificate',
    possession_letter: 'Possession Letter',
  };

  return names[type] || type;
}

/**
 * Calculate remaining time for signing
 */
export function getRemainingTime(expiringDateTime?: string): string | null {
  if (!expiringDateTime) return null;

  const expiry = new Date(expiringDateTime);
  const now = new Date();
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return 'Expired';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} remaining`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} remaining`;
  return 'Less than 1 hour remaining';
}

/**
 * Process signing event from DocuSign callback
 */
export function parseSigningEvent(url: URL): SigningEventData | null {
  const envelopeId = url.searchParams.get('envelopeId');
  const event = url.searchParams.get('event');
  const recipientId = url.searchParams.get('recipientId');

  if (!envelopeId || !event) return null;

  return {
    envelopeId,
    recipientId: recipientId || '',
    event: event as SigningEventData['event'],
    returnUrl: url.searchParams.get('returnUrl') || undefined,
  };
}

/**
 * Generate signing return URL with event handling
 */
export function generateReturnUrl(baseUrl: string, envelopeId: string): string {
  const url = new URL(baseUrl, window.location.origin);
  url.searchParams.set('envelopeId', envelopeId);
  return url.toString();
}

// DocuSign Embedded Signing Component Helper
export interface EmbeddedSigningConfig {
  url: string;
  onComplete?: () => void;
  onCancel?: () => void;
  onDecline?: (reason: string) => void;
  onError?: (error: string) => void;
  onSessionTimeout?: () => void;
}

/**
 * Handle DocuSign embedded signing messages
 */
export function setupEmbeddedSigningListener(
  config: EmbeddedSigningConfig
): () => void {
  const handleMessage = (event: MessageEvent) => {
    // Verify origin is DocuSign
    if (!event.origin.includes('docusign.com') && !event.origin.includes('docusign.net')) {
      return;
    }

    const { event: eventType, data } = event.data || {};

    switch (eventType) {
      case 'signing_complete':
        config.onComplete?.();
        break;
      case 'cancel':
        config.onCancel?.();
        break;
      case 'decline':
        config.onDecline?.(data?.declineReason || 'Unknown reason');
        break;
      case 'exception':
        config.onError?.(data?.errorCode || 'Unknown error');
        break;
      case 'session_timeout':
        config.onSessionTimeout?.();
        break;
    }
  };

  window.addEventListener('message', handleMessage);

  return () => {
    window.removeEventListener('message', handleMessage);
  };
}
Twilio Â· TS
'use client';

// Twilio Integration Service
// Handles video calling, SMS notifications, and chat

import apiClient from '@/services/api';

// Types
export interface VideoRoom {
  sid: string;
  name: string;
  status: 'in-progress' | 'completed' | 'failed';
  dateCreated: string;
  dateUpdated: string;
  duration?: number;
  type: 'peer-to-peer' | 'group' | 'group-small';
  maxParticipants: number;
  participants: Participant[];
  recordingEnabled: boolean;
  endTime?: string;
}

export interface Participant {
  sid: string;
  identity: string;
  status: 'connected' | 'disconnected';
  dateCreated: string;
  dateUpdated: string;
  duration?: number;
}

export interface VideoToken {
  token: string;
  identity: string;
  roomName: string;
  expiresAt: string;
}

export interface Recording {
  sid: string;
  roomSid: string;
  status: 'processing' | 'completed' | 'deleted' | 'failed';
  type: 'audio' | 'video';
  duration: number;
  size: number;
  dateCreated: string;
  downloadUrl?: string;
  participantIdentity?: string;
}

export interface ScheduledCall {
  id: string;
  roomName: string;
  scheduledAt: string;
  duration: number; // in minutes
  participants: ScheduledParticipant[];
  propertyId?: string;
  propertyTitle?: string;
  agentId?: string;
  agentName?: string;
  type: 'showing' | 'consultation' | 'meeting';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  reminderSent: boolean;
}

export interface ScheduledParticipant {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  role: 'host' | 'participant';
  notified: boolean;
}

export interface SMSMessage {
  sid: string;
  to: string;
  from: string;
  body: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'undelivered';
  dateCreated: string;
  dateSent?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface CallSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenShareEnabled: boolean;
  recordingEnabled: boolean;
  chatEnabled: boolean;
  maxDuration: number; // in minutes
  waitingRoomEnabled: boolean;
  backgroundBlur: boolean;
  noiseCancellation: boolean;
}

// Video device types
export interface MediaDevice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'audiooutput' | 'videoinput';
}

export interface VideoQuality {
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
}

// Quality presets
export const VIDEO_QUALITY_PRESETS: Record<string, VideoQuality> = {
  low: { width: 640, height: 360, frameRate: 15, bitrate: 500000 },
  medium: { width: 960, height: 540, frameRate: 24, bitrate: 1000000 },
  high: { width: 1280, height: 720, frameRate: 30, bitrate: 2000000 },
  hd: { width: 1920, height: 1080, frameRate: 30, bitrate: 4000000 },
};

/**
 * Create a video room
 */
export async function createVideoRoom(params: {
  name: string;
  type?: 'peer-to-peer' | 'group' | 'group-small';
  maxParticipants?: number;
  recordingEnabled?: boolean;
  statusCallback?: string;
}): Promise<VideoRoom> {
  const response = await apiClient.post<{
    success: boolean;
    data: VideoRoom;
    error?: string;
  }>('/video/rooms', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create video room');
  }

  return response.data.data;
}

/**
 * Get video room by name or SID
 */
export async function getVideoRoom(roomIdentifier: string): Promise<VideoRoom> {
  const response = await apiClient.get<{
    success: boolean;
    data: VideoRoom;
    error?: string;
  }>(`/video/rooms/${roomIdentifier}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get video room');
  }

  return response.data.data;
}

/**
 * End a video room
 */
export async function endVideoRoom(roomSid: string): Promise<void> {
  const response = await apiClient.post<{
    success: boolean;
    error?: string;
  }>(`/video/rooms/${roomSid}/end`);

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to end video room');
  }
}

/**
 * Get access token for video room
 */
export async function getVideoToken(params: {
  roomName: string;
  identity: string;
  duration?: number;
}): Promise<VideoToken> {
  const response = await apiClient.post<{
    success: boolean;
    data: VideoToken;
    error?: string;
  }>('/video/token', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get video token');
  }

  return response.data.data;
}

/**
 * Get room recordings
 */
export async function getRoomRecordings(roomSid: string): Promise<Recording[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: Recording[];
    error?: string;
  }>(`/video/rooms/${roomSid}/recordings`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get recordings');
  }

  return response.data.data;
}

/**
 * Delete a recording
 */
export async function deleteRecording(recordingSid: string): Promise<void> {
  const response = await apiClient.delete<{
    success: boolean;
    error?: string;
  }>(`/video/recordings/${recordingSid}`);

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to delete recording');
  }
}

/**
 * Schedule a video call
 */
export async function scheduleCall(params: {
  scheduledAt: string;
  duration: number;
  participants: Omit<ScheduledParticipant, 'notified'>[];
  propertyId?: string;
  type: ScheduledCall['type'];
  notes?: string;
  sendReminders?: boolean;
}): Promise<ScheduledCall> {
  const response = await apiClient.post<{
    success: boolean;
    data: ScheduledCall;
    error?: string;
  }>('/video/schedule', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to schedule call');
  }

  return response.data.data;
}

/**
 * Get scheduled calls
 */
export async function getScheduledCalls(params?: {
  status?: ScheduledCall['status'];
  fromDate?: string;
  toDate?: string;
  propertyId?: string;
}): Promise<ScheduledCall[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: ScheduledCall[];
    error?: string;
  }>('/video/schedule', { params });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get scheduled calls');
  }

  return response.data.data;
}

/**
 * Cancel a scheduled call
 */
export async function cancelScheduledCall(
  callId: string,
  notifyParticipants: boolean = true
): Promise<void> {
  const response = await apiClient.post<{
    success: boolean;
    error?: string;
  }>(`/video/schedule/${callId}/cancel`, { notifyParticipants });

  if (!response.data.success) {
    throw new Error(response.data.error || 'Failed to cancel call');
  }
}

/**
 * Reschedule a call
 */
export async function rescheduleCall(
  callId: string,
  newTime: string,
  notifyParticipants: boolean = true
): Promise<ScheduledCall> {
  const response = await apiClient.post<{
    success: boolean;
    data: ScheduledCall;
    error?: string;
  }>(`/video/schedule/${callId}/reschedule`, {
    scheduledAt: newTime,
    notifyParticipants,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to reschedule call');
  }

  return response.data.data;
}

/**
 * Send SMS message
 */
export async function sendSMS(params: {
  to: string;
  body: string;
  mediaUrl?: string;
}): Promise<SMSMessage> {
  const response = await apiClient.post<{
    success: boolean;
    data: SMSMessage;
    error?: string;
  }>('/sms/send', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to send SMS');
  }

  return response.data.data;
}

/**
 * Send bulk SMS (for notifications)
 */
export async function sendBulkSMS(params: {
  recipients: string[];
  body: string;
  sendAt?: string;
}): Promise<{ sent: number; failed: number; errors: string[] }> {
  const response = await apiClient.post<{
    success: boolean;
    data: { sent: number; failed: number; errors: string[] };
    error?: string;
  }>('/sms/bulk', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to send bulk SMS');
  }

  return response.data.data;
}

/**
 * Get SMS history
 */
export async function getSMSHistory(params?: {
  limit?: number;
  startDate?: string;
  endDate?: string;
  to?: string;
}): Promise<SMSMessage[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: SMSMessage[];
    error?: string;
  }>('/sms/history', { params });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get SMS history');
  }

  return response.data.data;
}

// Media Device Helpers

/**
 * Get available media devices
 */
export async function getMediaDevices(): Promise<{
  audioInputs: MediaDevice[];
  audioOutputs: MediaDevice[];
  videoInputs: MediaDevice[];
}> {
  try {
    // Request permissions first
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    
    const devices = await navigator.mediaDevices.enumerateDevices();

    return {
      audioInputs: devices
        .filter((d) => d.kind === 'audioinput')
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${d.deviceId.slice(0, 8)}`,
          kind: d.kind,
        })),
      audioOutputs: devices
        .filter((d) => d.kind === 'audiooutput')
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Speaker ${d.deviceId.slice(0, 8)}`,
          kind: d.kind,
        })),
      videoInputs: devices
        .filter((d) => d.kind === 'videoinput')
        .map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${d.deviceId.slice(0, 8)}`,
          kind: d.kind,
        })),
    };
  } catch (error) {
    console.error('Failed to enumerate devices:', error);
    return { audioInputs: [], audioOutputs: [], videoInputs: [] };
  }
}

/**
 * Test microphone audio level
 */
export async function testMicrophone(
  deviceId?: string
): Promise<{ supported: boolean; stream?: MediaStream }> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: deviceId ? { deviceId: { exact: deviceId } } : true,
    });

    return { supported: true, stream };
  } catch (error) {
    console.error('Microphone test failed:', error);
    return { supported: false };
  }
}

/**
 * Test camera
 */
export async function testCamera(
  deviceId?: string
): Promise<{ supported: boolean; stream?: MediaStream }> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
    });

    return { supported: true, stream };
  } catch (error) {
    console.error('Camera test failed:', error);
    return { supported: false };
  }
}

/**
 * Stop media stream
 */
export function stopMediaStream(stream: MediaStream): void {
  stream.getTracks().forEach((track) => track.stop());
}

/**
 * Check browser support for video calling
 */
export function checkBrowserSupport(): {
  supported: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    issues.push('Media devices API not supported');
  }

  if (!window.RTCPeerConnection) {
    issues.push('WebRTC not supported');
  }

  if (!window.MediaRecorder) {
    issues.push('Media recording not supported');
  }

  return {
    supported: issues.length === 0,
    issues,
  };
}

// Helper functions

/**
 * Format call duration
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get call type display text
 */
export function getCallTypeText(type: ScheduledCall['type']): string {
  const texts: Record<ScheduledCall['type'], string> = {
    showing: 'Property Showing',
    consultation: 'Consultation',
    meeting: 'Meeting',
  };

  return texts[type] || type;
}

/**
 * Get call status color
 */
export function getCallStatusColor(status: ScheduledCall['status']): string {
  const colors: Record<ScheduledCall['status'], string> = {
    scheduled: 'blue',
    'in-progress': 'green',
    completed: 'gray',
    cancelled: 'red',
  };

  return colors[status] || 'gray';
}

/**
 * Generate meeting invite text
 */
export function generateInviteText(call: ScheduledCall, joinUrl: string): string {
  const date = new Date(call.scheduledAt);
  const formattedDate = date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let text = `You're invited to a ${getCallTypeText(call.type)}`;
  
  if (call.propertyTitle) {
    text += ` for ${call.propertyTitle}`;
  }

  text += `\n\nDate: ${formattedDate}`;
  text += `\nTime: ${formattedTime}`;
  text += `\nDuration: ${call.duration} minutes`;
  
  if (call.agentName) {
    text += `\nHost: ${call.agentName}`;
  }

  text += `\n\nJoin the call: ${joinUrl}`;

  if (call.notes) {
    text += `\n\nNotes: ${call.notes}`;
  }

  return text;
}

/**
 * Check if call is starting soon (within 10 minutes)
 */
export function isCallStartingSoon(scheduledAt: string): boolean {
  const callTime = new Date(scheduledAt).getTime();
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;

  return callTime - now <= tenMinutes && callTime - now > 0;
}

/**
 * Check if call can be joined (within 5 minutes before to duration after)
 */
export function canJoinCall(
  scheduledAt: string,
  duration: number
): boolean {
  const callTime = new Date(scheduledAt).getTime();
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000;
  const callDuration = duration * 60 * 1000;

  return now >= callTime - fiveMinutes && now <= callTime + callDuration;
}

// Twilio Video SDK Integration
// Note: This requires the twilio-video npm package to be installed

/**
 * Connect to a Twilio video room
 * This is a wrapper that would use the twilio-video SDK
 */
export async function connectToRoom(params: {
  token: string;
  roomName: string;
  options?: {
    audio?: boolean | MediaTrackConstraints;
    video?: boolean | MediaTrackConstraints;
    dominantSpeaker?: boolean;
    networkQuality?: boolean;
    bandwidthProfile?: {
      video: {
        mode: 'grid' | 'collaboration' | 'presentation';
        maxTracks?: number;
        dominantSpeakerPriority?: 'low' | 'standard' | 'high';
      };
    };
  };
}): Promise<any> {
  // This would use the actual Twilio Video SDK
  // import { connect } from 'twilio-video';
  // return connect(params.token, { name: params.roomName, ...params.options });
  
  console.log('Twilio Video SDK connection would be established here');
  throw new Error('Twilio Video SDK not installed. Run: npm install twilio-video');
}

// Export types
export type { MediaDevice, VideoQuality };
Web3 Â· TS
'use client';

// Web3 Blockchain Integration Service
// Handles wallet connection, property tokenization, and DAO governance

import apiClient from '@/services/api';

// Types
export interface WalletInfo {
  address: string;
  chainId: number;
  chainName: string;
  balance: string;
  connected: boolean;
}

export interface TokenizedProperty {
  id: string;
  propertyId: string;
  contractAddress: string;
  tokenSymbol: string;
  totalSupply: number;
  availableTokens: number;
  pricePerToken: string;
  currency: 'ETH' | 'MATIC' | 'USDC' | 'USDT';
  minInvestment: number;
  propertyValue: string;
  tokenHolders: number;
  returns: {
    annual: number;
    rental: number;
    appreciation: number;
  };
  status: 'active' | 'sold-out' | 'pending' | 'delisted';
  documents: TokenDocument[];
  propertyDetails: {
    title: string;
    location: string;
    type: string;
    area: number;
    image: string;
  };
  createdAt: string;
  lastTradeAt?: string;
}

export interface TokenDocument {
  id: string;
  name: string;
  type: 'legal' | 'valuation' | 'inspection' | 'insurance' | 'other';
  ipfsHash: string;
  uploadedAt: string;
  verified: boolean;
}

export interface TokenHolding {
  propertyId: string;
  propertyTitle: string;
  contractAddress: string;
  tokenBalance: number;
  tokenSymbol: string;
  currentValue: string;
  purchaseValue: string;
  returns: number;
  claimableRewards: string;
  transactions: TokenTransaction[];
}

export interface TokenTransaction {
  id: string;
  type: 'purchase' | 'sale' | 'reward' | 'transfer';
  amount: number;
  price: string;
  txHash: string;
  timestamp: string;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface DAOProposal {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  category: 'maintenance' | 'improvement' | 'management' | 'distribution' | 'other';
  proposer: {
    address: string;
    name?: string;
    tokenBalance: number;
  };
  votes: {
    for: number;
    against: number;
    abstain: number;
    totalVotingPower: number;
    quorum: number;
  };
  status: 'active' | 'passed' | 'rejected' | 'executed' | 'cancelled';
  startDate: string;
  endDate: string;
  executionDate?: string;
  discussionUrl?: string;
  transactionHash?: string;
}

export interface DAOVote {
  proposalId: string;
  voter: string;
  support: 'for' | 'against' | 'abstain';
  votingPower: number;
  reason?: string;
  timestamp: string;
  txHash: string;
}

export interface RewardDistribution {
  id: string;
  propertyId: string;
  propertyTitle: string;
  amount: string;
  currency: string;
  distributionDate: string;
  source: 'rental' | 'sale' | 'other';
  yourShare: string;
  claimed: boolean;
  claimTxHash?: string;
}

// Supported chains
export const SUPPORTED_CHAINS = {
  ethereum: { id: 1, name: 'Ethereum', symbol: 'ETH', explorer: 'https://etherscan.io' },
  polygon: { id: 137, name: 'Polygon', symbol: 'MATIC', explorer: 'https://polygonscan.com' },
  arbitrum: { id: 42161, name: 'Arbitrum', symbol: 'ETH', explorer: 'https://arbiscan.io' },
  base: { id: 8453, name: 'Base', symbol: 'ETH', explorer: 'https://basescan.org' },
  // Testnets
  sepolia: { id: 11155111, name: 'Sepolia', symbol: 'ETH', explorer: 'https://sepolia.etherscan.io' },
  mumbai: { id: 80001, name: 'Mumbai', symbol: 'MATIC', explorer: 'https://mumbai.polygonscan.com' },
} as const;

export type SupportedChain = keyof typeof SUPPORTED_CHAINS;

// Wallet state singleton
let walletState: WalletInfo | null = null;
let walletChangeCallbacks: ((wallet: WalletInfo | null) => void)[] = [];

/**
 * Check if Web3 is available
 */
export function isWeb3Available(): boolean {
  return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
}

/**
 * Get current wallet info
 */
export function getWalletInfo(): WalletInfo | null {
  return walletState;
}

/**
 * Subscribe to wallet changes
 */
export function onWalletChange(
  callback: (wallet: WalletInfo | null) => void
): () => void {
  walletChangeCallbacks.push(callback);

  return () => {
    walletChangeCallbacks = walletChangeCallbacks.filter((cb) => cb !== callback);
  };
}

/**
 * Notify wallet change subscribers
 */
function notifyWalletChange(wallet: WalletInfo | null): void {
  walletState = wallet;
  walletChangeCallbacks.forEach((cb) => cb(wallet));
}

/**
 * Connect wallet (MetaMask, WalletConnect, etc.)
 */
export async function connectWallet(): Promise<WalletInfo> {
  if (!isWeb3Available()) {
    throw new Error('Please install a Web3 wallet like MetaMask');
  }

  const ethereum = (window as any).ethereum;

  try {
    // Request account access
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please unlock your wallet.');
    }

    const address = accounts[0];
    const chainId = parseInt(await ethereum.request({ method: 'eth_chainId' }), 16);
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });

    const chainInfo = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);

    const walletInfo: WalletInfo = {
      address,
      chainId,
      chainName: chainInfo?.name || 'Unknown Network',
      balance: formatEther(balance),
      connected: true,
    };

    // Set up event listeners
    ethereum.on('accountsChanged', handleAccountsChanged);
    ethereum.on('chainChanged', handleChainChanged);
    ethereum.on('disconnect', handleDisconnect);

    // Verify wallet on backend
    await verifyWallet(address);

    notifyWalletChange(walletInfo);
    return walletInfo;
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error('Please connect your wallet to continue');
    }
    throw error;
  }
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet(): Promise<void> {
  if (isWeb3Available()) {
    const ethereum = (window as any).ethereum;
    ethereum.removeListener('accountsChanged', handleAccountsChanged);
    ethereum.removeListener('chainChanged', handleChainChanged);
    ethereum.removeListener('disconnect', handleDisconnect);
  }

  notifyWalletChange(null);
}

/**
 * Switch to a different chain
 */
export async function switchChain(chainKey: SupportedChain): Promise<void> {
  if (!isWeb3Available()) {
    throw new Error('Web3 wallet not found');
  }

  const chain = SUPPORTED_CHAINS[chainKey];
  const ethereum = (window as any).ethereum;

  try {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chain.id.toString(16)}` }],
    });
  } catch (error: any) {
    // Chain not added, try to add it
    if (error.code === 4902) {
      await addChain(chainKey);
    } else {
      throw error;
    }
  }
}

/**
 * Add a chain to wallet
 */
async function addChain(chainKey: SupportedChain): Promise<void> {
  const chain = SUPPORTED_CHAINS[chainKey];
  const ethereum = (window as any).ethereum;

  const chainConfig: Record<SupportedChain, any> = {
    ethereum: null, // Default chain
    polygon: {
      chainId: `0x${chain.id.toString(16)}`,
      chainName: 'Polygon Mainnet',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrls: ['https://polygon-rpc.com'],
      blockExplorerUrls: [chain.explorer],
    },
    arbitrum: {
      chainId: `0x${chain.id.toString(16)}`,
      chainName: 'Arbitrum One',
      nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://arb1.arbitrum.io/rpc'],
      blockExplorerUrls: [chain.explorer],
    },
    base: {
      chainId: `0x${chain.id.toString(16)}`,
      chainName: 'Base',
      nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://mainnet.base.org'],
      blockExplorerUrls: [chain.explorer],
    },
    sepolia: {
      chainId: `0x${chain.id.toString(16)}`,
      chainName: 'Sepolia Testnet',
      nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
      rpcUrls: ['https://sepolia.infura.io/v3/'],
      blockExplorerUrls: [chain.explorer],
    },
    mumbai: {
      chainId: `0x${chain.id.toString(16)}`,
      chainName: 'Mumbai Testnet',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
      blockExplorerUrls: [chain.explorer],
    },
  };

  const config = chainConfig[chainKey];
  if (config) {
    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [config],
    });
  }
}

// Event handlers
async function handleAccountsChanged(accounts: string[]): Promise<void> {
  if (accounts.length === 0) {
    notifyWalletChange(null);
  } else {
    await connectWallet();
  }
}

async function handleChainChanged(): Promise<void> {
  // Reconnect with new chain
  await connectWallet();
}

function handleDisconnect(): void {
  notifyWalletChange(null);
}

/**
 * Verify wallet ownership on backend
 */
async function verifyWallet(address: string): Promise<void> {
  const response = await apiClient.post('/blockchain/verify-wallet', { address });
  if (!response.data.success) {
    console.warn('Wallet verification failed:', response.data.error);
  }
}

/**
 * Sign a message with wallet
 */
export async function signMessage(message: string): Promise<string> {
  if (!isWeb3Available() || !walletState) {
    throw new Error('Wallet not connected');
  }

  const ethereum = (window as any).ethereum;

  const signature = await ethereum.request({
    method: 'personal_sign',
    params: [message, walletState.address],
  });

  return signature;
}

/**
 * Get tokenized properties
 */
export async function getTokenizedProperties(params?: {
  status?: TokenizedProperty['status'];
  minPrice?: number;
  maxPrice?: number;
  chain?: SupportedChain;
  page?: number;
  limit?: number;
}): Promise<{ properties: TokenizedProperty[]; total: number }> {
  const response = await apiClient.get<{
    success: boolean;
    data: { properties: TokenizedProperty[]; total: number };
    error?: string;
  }>('/blockchain/properties', { params });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get tokenized properties');
  }

  return response.data.data;
}

/**
 * Get tokenized property by ID
 */
export async function getTokenizedProperty(id: string): Promise<TokenizedProperty> {
  const response = await apiClient.get<{
    success: boolean;
    data: TokenizedProperty;
    error?: string;
  }>(`/blockchain/properties/${id}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get property');
  }

  return response.data.data;
}

/**
 * Purchase property tokens
 */
export async function purchaseTokens(params: {
  propertyId: string;
  amount: number;
  walletAddress: string;
}): Promise<{ txHash: string; tokens: number }> {
  if (!walletState) {
    throw new Error('Wallet not connected');
  }

  const response = await apiClient.post<{
    success: boolean;
    data: { txHash: string; tokens: number };
    error?: string;
  }>('/blockchain/purchase', params);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to purchase tokens');
  }

  return response.data.data;
}

/**
 * Get user's token holdings
 */
export async function getTokenHoldings(
  walletAddress?: string
): Promise<TokenHolding[]> {
  const address = walletAddress || walletState?.address;
  if (!address) {
    throw new Error('No wallet address provided');
  }

  const response = await apiClient.get<{
    success: boolean;
    data: TokenHolding[];
    error?: string;
  }>(`/blockchain/holdings/${address}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get holdings');
  }

  return response.data.data;
}

/**
 * Get DAO proposals for a property
 */
export async function getDAOProposals(params?: {
  propertyId?: string;
  status?: DAOProposal['status'];
  category?: DAOProposal['category'];
}): Promise<DAOProposal[]> {
  const response = await apiClient.get<{
    success: boolean;
    data: DAOProposal[];
    error?: string;
  }>('/blockchain/dao/proposals', { params });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get proposals');
  }

  return response.data.data;
}

/**
 * Get DAO proposal by ID
 */
export async function getDAOProposal(proposalId: string): Promise<DAOProposal> {
  const response = await apiClient.get<{
    success: boolean;
    data: DAOProposal;
    error?: string;
  }>(`/blockchain/dao/proposals/${proposalId}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get proposal');
  }

  return response.data.data;
}

/**
 * Create a DAO proposal
 */
export async function createDAOProposal(params: {
  propertyId: string;
  title: string;
  description: string;
  category: DAOProposal['category'];
  discussionUrl?: string;
}): Promise<DAOProposal> {
  if (!walletState) {
    throw new Error('Wallet not connected');
  }

  // Sign the proposal
  const message = `Create proposal: ${params.title}`;
  const signature = await signMessage(message);

  const response = await apiClient.post<{
    success: boolean;
    data: DAOProposal;
    error?: string;
  }>('/blockchain/dao/proposals', {
    ...params,
    signature,
    walletAddress: walletState.address,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to create proposal');
  }

  return response.data.data;
}

/**
 * Vote on a DAO proposal
 */
export async function voteOnProposal(params: {
  proposalId: string;
  support: 'for' | 'against' | 'abstain';
  reason?: string;
}): Promise<DAOVote> {
  if (!walletState) {
    throw new Error('Wallet not connected');
  }

  // Sign the vote
  const message = `Vote ${params.support} on proposal ${params.proposalId}`;
  const signature = await signMessage(message);

  const response = await apiClient.post<{
    success: boolean;
    data: DAOVote;
    error?: string;
  }>(`/blockchain/dao/proposals/${params.proposalId}/vote`, {
    ...params,
    signature,
    walletAddress: walletState.address,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to vote');
  }

  return response.data.data;
}

/**
 * Get reward distributions
 */
export async function getRewardDistributions(
  walletAddress?: string
): Promise<RewardDistribution[]> {
  const address = walletAddress || walletState?.address;
  if (!address) {
    throw new Error('No wallet address provided');
  }

  const response = await apiClient.get<{
    success: boolean;
    data: RewardDistribution[];
    error?: string;
  }>(`/blockchain/rewards/${address}`);

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to get rewards');
  }

  return response.data.data;
}

/**
 * Claim rewards
 */
export async function claimRewards(
  distributionIds: string[]
): Promise<{ txHash: string; amount: string }> {
  if (!walletState) {
    throw new Error('Wallet not connected');
  }

  const response = await apiClient.post<{
    success: boolean;
    data: { txHash: string; amount: string };
    error?: string;
  }>('/blockchain/rewards/claim', {
    distributionIds,
    walletAddress: walletState.address,
  });

  if (!response.data.success || !response.data.data) {
    throw new Error(response.data.error || 'Failed to claim rewards');
  }

  return response.data.data;
}

// Helper functions

/**
 * Format Ether value
 */
export function formatEther(wei: string): string {
  const ether = parseInt(wei, 16) / 1e18;
  return ether.toFixed(4);
}

/**
 * Format token amount
 */
export function formatTokenAmount(amount: number, symbol: string): string {
  return `${amount.toLocaleString()} ${symbol}`;
}

/**
 * Shorten wallet address
 */
export function shortenAddress(address: string, chars: number = 4): string {
  if (!address) return '';
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Get explorer URL for transaction
 */
export function getExplorerUrl(
  txHash: string,
  chainId: number,
  type: 'tx' | 'address' | 'token' = 'tx'
): string {
  const chain = Object.values(SUPPORTED_CHAINS).find((c) => c.id === chainId);
  const explorer = chain?.explorer || 'https://etherscan.io';
  return `${explorer}/${type}/${txHash}`;
}

/**
 * Calculate voting power percentage
 */
export function calculateVotingPower(
  tokenBalance: number,
  totalSupply: number
): number {
  if (totalSupply === 0) return 0;
  return (tokenBalance / totalSupply) * 100;
}

/**
 * Check if proposal has reached quorum
 */
export function hasReachedQuorum(proposal: DAOProposal): boolean {
  const totalVotes =
    proposal.votes.for + proposal.votes.against + proposal.votes.abstain;
  return totalVotes >= proposal.votes.quorum;
}

/**
 * Get proposal result
 */
export function getProposalResult(proposal: DAOProposal): 'pending' | 'passed' | 'rejected' {
  if (proposal.status === 'active') return 'pending';
  if (['passed', 'executed'].includes(proposal.status)) return 'passed';
  return 'rejected';
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Check if wallet is token holder
 */
export function isTokenHolder(holdings: TokenHolding[], propertyId: string): boolean {
  return holdings.some((h) => h.propertyId === propertyId && h.tokenBalance > 0);
}

// Export types
export type { WalletInfo, TokenizedProperty, TokenHolding, DAOProposal, DAOVote };
Index Â· TS
// Integration Services Index
// Export all third-party service integrations

// Google Maps - Map display, geocoding, places, directions
export * from './google-maps';
export {
  loadGoogleMaps,
  createMap,
  geocodeAddress,
  reverseGeocode,
  getDirections,
  searchNearby,
  getPlacePredictions,
  getPlaceDetails,
  createAutocomplete,
  createPropertyMarker,
  createDrawingManager,
  getStaticMapUrl,
  calculateDistance,
  formatDistance,
} from './google-maps';

// Stripe - Payments, subscriptions, billing
export * from './stripe';
export {
  getStripe,
  createSubscriptionCheckout,
  createOneTimeCheckout,
  redirectToCheckout,
  createPortalSession,
  getCurrentSubscription,
  cancelSubscription,
  resumeSubscription,
  updateSubscription,
  getSubscriptionPlans,
  getPaymentMethods,
  addPaymentMethod,
  removePaymentMethod,
  setDefaultPaymentMethod,
  getInvoices,
  validateCoupon,
  createPaymentIntent,
  confirmPayment,
  formatAmount,
  getCardBrandIcon,
  isSubscriptionActive,
} from './stripe';

// DocuSign - Document signing
export * from './docusign';
export {
  createEnvelope,
  createEnvelopeFromTemplate,
  getEnvelope,
  listEnvelopes,
  getEmbeddedSigningUrl,
  sendEnvelope,
  voidEnvelope,
  resendEnvelope,
  downloadDocument,
  downloadCombinedDocument,
  downloadCertificate,
  getTemplates,
  createPropertyDocument,
  getPropertySigningStatus,
  getStatusColor as getDocuSignStatusColor,
  getStatusText as getDocuSignStatusText,
  formatDocumentType,
  getRemainingTime,
  DOCUMENT_TEMPLATES,
} from './docusign';

// Twilio - Video calls, SMS
export * from './twilio';
export {
  createVideoRoom,
  getVideoRoom,
  endVideoRoom,
  getVideoToken,
  getRoomRecordings,
  scheduleCall,
  getScheduledCalls,
  cancelScheduledCall,
  rescheduleCall,
  sendSMS,
  sendBulkSMS,
  getSMSHistory,
  getMediaDevices,
  testMicrophone,
  testCamera,
  stopMediaStream,
  checkBrowserSupport,
  formatDuration,
  getCallTypeText,
  getCallStatusColor,
  generateInviteText,
  isCallStartingSoon,
  canJoinCall,
  VIDEO_QUALITY_PRESETS,
} from './twilio';

// Web3 - Blockchain, tokenization, DAO
export * from './web3';
export {
  isWeb3Available,
  getWalletInfo,
  onWalletChange,
  connectWallet,
  disconnectWallet,
  switchChain,
  signMessage,
  getTokenizedProperties,
  getTokenizedProperty,
  purchaseTokens,
  getTokenHoldings,
  getDAOProposals,
  getDAOProposal,
  createDAOProposal,
  voteOnProposal,
  getRewardDistributions,
  claimRewards,
  formatEther,
  formatTokenAmount,
  shortenAddress,
  getExplorerUrl,
  calculateVotingPower,
  hasReachedQuorum,
  getProposalResult,
  SUPPORTED_CHAINS,
} from './web3';
Config Â· TS
// Environment Configuration
// Centralized configuration management for all environment variables

// App Configuration
export const APP_CONFIG = {
  name: 'Dharma Realty',
  tagline: 'Where Ancient Wisdom Meets Modern Living',
  description: 'India\'s first real estate platform combining Vastu Shastra with cutting-edge technology',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  environment: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  wsUrl: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  retryAttempts: parseInt(process.env.NEXT_PUBLIC_API_RETRY_ATTEMPTS || '3', 10),
} as const;

// Google Maps Configuration
export const GOOGLE_MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  defaultCenter: {
    lat: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LAT || '19.0760'),
    lng: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_LNG || '72.8777'),
  },
  defaultZoom: parseInt(process.env.NEXT_PUBLIC_DEFAULT_ZOOM || '12', 10),
  libraries: ['places', 'geometry', 'drawing', 'visualization'] as const,
} as const;

// Stripe Configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  currency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'INR',
  locale: process.env.NEXT_PUBLIC_STRIPE_LOCALE || 'en-IN',
} as const;

// DocuSign Configuration
export const DOCUSIGN_CONFIG = {
  integrationKey: process.env.NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY || '',
  accountId: process.env.NEXT_PUBLIC_DOCUSIGN_ACCOUNT_ID || '',
  baseUrl: process.env.NEXT_PUBLIC_DOCUSIGN_BASE_URL || 'https://demo.docusign.net',
  oauthBaseUrl: process.env.NEXT_PUBLIC_DOCUSIGN_OAUTH_URL || 'https://account-d.docusign.com',
  redirectUri: process.env.NEXT_PUBLIC_DOCUSIGN_REDIRECT_URI || '',
} as const;

// Twilio Configuration
export const TWILIO_CONFIG = {
  accountSid: process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID || '',
  apiKeySid: process.env.NEXT_PUBLIC_TWILIO_API_KEY_SID || '',
  fromNumber: process.env.NEXT_PUBLIC_TWILIO_FROM_NUMBER || '',
} as const;

// Web3 Configuration
export const WEB3_CONFIG = {
  defaultChain: process.env.NEXT_PUBLIC_DEFAULT_CHAIN || 'polygon',
  infuraId: process.env.NEXT_PUBLIC_INFURA_ID || '',
  alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID || '',
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  contractAddresses: {
    propertyToken: process.env.NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS || '',
    dao: process.env.NEXT_PUBLIC_DAO_ADDRESS || '',
    marketplace: process.env.NEXT_PUBLIC_MARKETPLACE_ADDRESS || '',
  },
} as const;

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || '',
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '',
  sentryDsn: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  hotjarId: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  enableBlockchain: process.env.NEXT_PUBLIC_ENABLE_BLOCKCHAIN === 'true',
  enableVideoCall: process.env.NEXT_PUBLIC_ENABLE_VIDEO_CALL === 'true',
  enableDocuSign: process.env.NEXT_PUBLIC_ENABLE_DOCUSIGN === 'true',
  enableVastuAnalysis: process.env.NEXT_PUBLIC_ENABLE_VASTU !== 'false', // Default true
  enableClimateRisk: process.env.NEXT_PUBLIC_ENABLE_CLIMATE === 'true',
  enableChat: process.env.NEXT_PUBLIC_ENABLE_CHAT !== 'false', // Default true
  enablePushNotifications: process.env.NEXT_PUBLIC_ENABLE_PUSH === 'true',
  maintenanceMode: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
} as const;

// Upload Configuration
export const UPLOAD_CONFIG = {
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760', 10), // 10MB
  maxFiles: parseInt(process.env.NEXT_PUBLIC_MAX_FILES || '10', 10),
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  allowedDocTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL || '',
  s3Bucket: process.env.NEXT_PUBLIC_S3_BUCKET || '',
} as const;

// Pagination Defaults
export const PAGINATION_CONFIG = {
  defaultPageSize: parseInt(process.env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE || '12', 10),
  maxPageSize: parseInt(process.env.NEXT_PUBLIC_MAX_PAGE_SIZE || '50', 10),
  pageSizeOptions: [12, 24, 48, 96],
} as const;

// Cache Configuration
export const CACHE_CONFIG = {
  propertyListTTL: parseInt(process.env.NEXT_PUBLIC_PROPERTY_LIST_TTL || '300', 10), // 5 min
  propertyDetailTTL: parseInt(process.env.NEXT_PUBLIC_PROPERTY_DETAIL_TTL || '600', 10), // 10 min
  agentListTTL: parseInt(process.env.NEXT_PUBLIC_AGENT_LIST_TTL || '600', 10), // 10 min
  searchResultsTTL: parseInt(process.env.NEXT_PUBLIC_SEARCH_TTL || '60', 10), // 1 min
} as const;

// Social Links
export const SOCIAL_LINKS = {
  facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || 'https://facebook.com/dharmarealty',
  twitter: process.env.NEXT_PUBLIC_TWITTER_URL || 'https://twitter.com/dharmarealty',
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://instagram.com/dharmarealty',
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://linkedin.com/company/dharmarealty',
  youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL || 'https://youtube.com/@dharmarealty',
} as const;

// Contact Information
export const CONTACT_INFO = {
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@dharmarealty.in',
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+91 22 1234 5678',
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP || '+919876543210',
  address: process.env.NEXT_PUBLIC_ADDRESS || 'Dharma Tower, Bandra Kurla Complex, Mumbai 400051',
} as const;

// SEO Defaults
export const SEO_CONFIG = {
  defaultTitle: 'Dharma Realty - Vastu-Compliant Properties in India',
  titleTemplate: '%s | Dharma Realty',
  defaultDescription: 'Discover your perfect home with Dharma Realty. India\'s first platform combining Vastu Shastra wisdom with modern real estate technology.',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmarealty.in',
  ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || '/og-image.jpg',
  twitterHandle: '@dharmarealty',
} as const;

// Validate Required Configuration
export function validateConfig(): { valid: boolean; missing: string[] } {
  const requiredInProduction = [
    { key: 'NEXT_PUBLIC_API_URL', value: API_CONFIG.baseUrl },
    { key: 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY', value: GOOGLE_MAPS_CONFIG.apiKey },
    { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', value: STRIPE_CONFIG.publishableKey },
  ];

  const missing: string[] = [];

  if (APP_CONFIG.isProduction) {
    requiredInProduction.forEach(({ key, value }) => {
      if (!value || value === '' || value.includes('localhost')) {
        missing.push(key);
      }
    });
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}

// Get configuration by key (for dynamic access)
export function getConfig(key: string): any {
  const configs: Record<string, any> = {
    app: APP_CONFIG,
    api: API_CONFIG,
    googleMaps: GOOGLE_MAPS_CONFIG,
    stripe: STRIPE_CONFIG,
    docusign: DOCUSIGN_CONFIG,
    twilio: TWILIO_CONFIG,
    web3: WEB3_CONFIG,
    analytics: ANALYTICS_CONFIG,
    features: FEATURE_FLAGS,
    upload: UPLOAD_CONFIG,
    pagination: PAGINATION_CONFIG,
    cache: CACHE_CONFIG,
    social: SOCIAL_LINKS,
    contact: CONTACT_INFO,
    seo: SEO_CONFIG,
  };

  return configs[key];
}

// Check if feature is enabled
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

// Get environment-specific value
export function getEnvValue<T>(
  prodValue: T,
  devValue: T,
  testValue?: T
): T {
  if (APP_CONFIG.isProduction) return prodValue;
  if (APP_CONFIG.isTest && testValue !== undefined) return testValue;
  return devValue;
}
Utils Â· TS
// Utility Functions
// Common helper functions used throughout the application

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// =============================================================================
// CLASS UTILITIES
// =============================================================================

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// =============================================================================
// STRING UTILITIES
// =============================================================================

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Capitalize each word in string
 */
export function capitalizeWords(str: string): string {
  if (!str) return '';
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Convert string to slug (URL-friendly)
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Convert slug to readable string
 */
export function unslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (!str || str.length <= length) return str;
  return str.slice(0, length - suffix.length).trim() + suffix;
}

/**
 * Generate random string
 */
export function randomString(length: number = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
}

/**
 * Generate UUID v4
 */
export function uuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Strip HTML tags from string
 */
export function stripHtml(html: string): string {
  if (typeof document !== 'undefined') {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Pluralize word based on count
 */
export function pluralize(word: string, count: number, plural?: string): string {
  if (count === 1) return word;
  return plural || `${word}s`;
}

// =============================================================================
// NUMBER UTILITIES
// =============================================================================

/**
 * Format number with Indian locale (lakhs, crores)
 */
export function formatIndianNumber(num: number): string {
  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toLocaleString('en-IN');
}

/**
 * Format currency (INR)
 */
export function formatCurrency(
  amount: number,
  options: {
    currency?: string;
    locale?: string;
    compact?: boolean;
  } = {}
): string {
  const { currency = 'INR', locale = 'en-IN', compact = false } = options;

  if (compact) {
    if (amount >= 10000000) {
      return `â‚¹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `â‚¹${(amount / 100000).toFixed(2)} L`;
    }
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format area (sq ft)
 */
export function formatArea(sqft: number): string {
  if (sqft >= 43560) {
    return `${(sqft / 43560).toFixed(2)} acres`;
  }
  return `${sqft.toLocaleString('en-IN')} sq ft`;
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Clamp number between min and max
 */
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}

/**
 * Round to specific decimal places
 */
export function roundTo(num: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
}

/**
 * Calculate percentage
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// =============================================================================
// DATE UTILITIES
// =============================================================================

/**
 * Format date for display
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {}
): string {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return d.toLocaleDateString('en-IN', defaultOptions);
}

/**
 * Format date to short format
 */
export function formatDateShort(date: string | Date): string {
  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Format time
 */
export function formatTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format datetime
 */
export function formatDateTime(date: string | Date): string {
  return `${formatDateShort(date)} at ${formatTime(date)}`;
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
export function getRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} ${pluralize('minute', minutes)} ago`;
  if (hours < 24) return `${hours} ${pluralize('hour', hours)} ago`;
  if (days < 7) return `${days} ${pluralize('day', days)} ago`;
  if (weeks < 4) return `${weeks} ${pluralize('week', weeks)} ago`;
  if (months < 12) return `${months} ${pluralize('month', months)} ago`;
  return `${years} ${pluralize('year', years)} ago`;
}

/**
 * Check if date is today
 */
export function isToday(date: string | Date): boolean {
  const d = new Date(date);
  const today = new Date();
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is in the past
 */
export function isPast(date: string | Date): boolean {
  return new Date(date).getTime() < Date.now();
}

/**
 * Check if date is in the future
 */
export function isFuture(date: string | Date): boolean {
  return new Date(date).getTime() > Date.now();
}

/**
 * Add days to date
 */
export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get end of day
 */
export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

// =============================================================================
// ARRAY UTILITIES
// =============================================================================

/**
 * Group array by key
 */
export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Remove duplicates from array
 */
export function unique<T>(array: T[], key?: keyof T): T[] {
  if (key) {
    const seen = new Set();
    return array.filter((item) => {
      const val = item[key];
      if (seen.has(val)) return false;
      seen.add(val);
      return true;
    });
  }
  return [...new Set(array)];
}

/**
 * Sort array by key
 */
export function sortBy<T>(
  array: T[],
  key: keyof T | ((item: T) => any),
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = typeof key === 'function' ? key(a) : a[key];
    const bVal = typeof key === 'function' ? key(b) : b[key];
    const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return order === 'asc' ? comparison : -comparison;
  });
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}

/**
 * Pick random items from array
 */
export function sample<T>(array: T[], count: number = 1): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Shuffle array
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// =============================================================================
// OBJECT UTILITIES
// =============================================================================

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pick specific keys from object
 */
export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Omit specific keys from object
 */
export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

/**
 * Check if object is empty
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Remove null/undefined values from object
 */
export function compact<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((result, [key, value]) => {
    if (value != null && value !== '') {
      (result as any)[key] = value;
    }
    return result;
  }, {} as Partial<T>);
}

// =============================================================================
// URL UTILITIES
// =============================================================================

/**
 * Build URL with query params
 */
export function buildUrl(baseUrl: string, params: Record<string, any>): string {
  const url = new URL(baseUrl, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value != null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

/**
 * Parse query string to object
 */
export function parseQueryString(queryString: string): Record<string, string> {
  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Get query param from URL
 */
export function getQueryParam(url: string, param: string): string | null {
  try {
    const urlObj = new URL(url, window.location.origin);
    return urlObj.searchParams.get(param);
  } catch {
    return null;
  }
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const re = /^(\+91)?[6-9]\d{9}$/;
  return re.test(phone.replace(/[\s-]/g, ''));
}

/**
 * Validate PAN number
 */
export function isValidPAN(pan: string): boolean {
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(pan.toUpperCase());
}

/**
 * Validate Aadhaar number
 */
export function isValidAadhaar(aadhaar: string): boolean {
  const re = /^\d{12}$/;
  return re.test(aadhaar.replace(/[\s-]/g, ''));
}

/**
 * Validate pincode (Indian)
 */
export function isValidPincode(pincode: string): boolean {
  const re = /^[1-9][0-9]{5}$/;
  return re.test(pincode);
}

/**
 * Validate URL
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// =============================================================================
// BROWSER UTILITIES
// =============================================================================

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}

/**
 * Download file from blob
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Detect mobile device
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Get browser name
 */
export function getBrowser(): string {
  if (typeof window === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari')) return 'Safari';
  if (ua.includes('Edge')) return 'Edge';
  if (ua.includes('MSIE') || ua.includes('Trident')) return 'IE';
  return 'unknown';
}

/**
 * Scroll to element
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function (...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Wait for specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// =============================================================================
// PROPERTY UTILITIES
// =============================================================================

/**
 * Format property type for display
 */
export function formatPropertyType(type: string): string {
  const types: Record<string, string> = {
    apartment: 'Apartment',
    house: 'House',
    villa: 'Villa',
    penthouse: 'Penthouse',
    plot: 'Plot',
    commercial: 'Commercial',
    office: 'Office Space',
    shop: 'Shop',
    warehouse: 'Warehouse',
    farmhouse: 'Farmhouse',
    builder_floor: 'Builder Floor',
  };
  return types[type.toLowerCase()] || capitalizeWords(type.replace(/_/g, ' '));
}

/**
 * Format property status
 */
export function formatPropertyStatus(status: string): string {
  const statuses: Record<string, string> = {
    available: 'Available',
    sold: 'Sold',
    rented: 'Rented',
    pending: 'Under Offer',
    off_market: 'Off Market',
    coming_soon: 'Coming Soon',
  };
  return statuses[status.toLowerCase()] || capitalizeWords(status);
}

/**
 * Get Vastu score color
 */
export function getVastuScoreColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'red';
}

/**
 * Get Vastu score label
 */
export function getVastuScoreLabel(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Average';
  return 'Needs Improvement';
}

/**
 * Format bedrooms/bathrooms display
 */
export function formatBedBath(bedrooms: number, bathrooms: number): string {
  return `${bedrooms} ${pluralize('Bed', bedrooms)}, ${bathrooms} ${pluralize('Bath', bathrooms)}`;
}
Index Â· TS
// Library Exports
// Centralized exports for lib utilities

export * from './config';
export * from './utils';
export * from './seo';

// Re-export commonly used utilities
export {
  cn,
  formatCurrency,
  formatIndianNumber,
  formatArea,
  formatDate,
  formatDateTime,
  getRelativeTime,
  truncate,
  slugify,
  capitalize,
  isValidEmail,
  isValidPhone,
  debounce,
  throttle,
  copyToClipboard,
  isMobile,
  formatPropertyType,
  getVastuScoreColor,
  getVastuScoreLabel,
} from './utils';

export {
  APP_CONFIG,
  API_CONFIG,
  FEATURE_FLAGS,
  isFeatureEnabled,
  validateConfig,
} from './config';

export {
  generateMetadata,
  generatePropertyMetadata,
  generateArticleMetadata,
  generateOrganizationSchema,
  generatePropertySchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  JsonLd,
} from './seo';

.env Â· EXAMPLE

## =============================================================================
## DHARMA REALTY - ENVIRONMENT VARIABLES
## =============================================================================
## Copy this file to .env.local for development or set in production environment

## =============================================================================
## APPLICATION
## =============================================================================
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_SITE_URL=https://dharmarealty.in
NEXT_PUBLIC_OG_IMAGE=/og-image.jpg

## =============================================================================
## API CONFIGURATION
## =============================================================================
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_WS_URL=http://localhost:4000
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_API_RETRY_ATTEMPTS=3

## =============================================================================
## GOOGLE MAPS
## =============================================================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_DEFAULT_LAT=19.0760
NEXT_PUBLIC_DEFAULT_LNG=72.8777
NEXT_PUBLIC_DEFAULT_ZOOM=12

## =============================================================================
## STRIPE PAYMENTS
## =============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_DEFAULT_CURRENCY=INR
NEXT_PUBLIC_STRIPE_LOCALE=en-IN

## =============================================================================
## DOCUSIGN
## =============================================================================
NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY=your_docusign_integration_key
NEXT_PUBLIC_DOCUSIGN_ACCOUNT_ID=your_docusign_account_id
NEXT_PUBLIC_DOCUSIGN_BASE_URL=https://demo.docusign.net
NEXT_PUBLIC_DOCUSIGN_OAUTH_URL=https://account-d.docusign.com
NEXT_PUBLIC_DOCUSIGN_REDIRECT_URI=http://localhost:3000/callback/docusign
DOCUSIGN_SECRET_KEY=your_docusign_secret_key
DOCUSIGN_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
your_private_key_here
-----END RSA PRIVATE KEY-----"

## =============================================================================
## TWILIO
## =============================================================================
NEXT_PUBLIC_TWILIO_ACCOUNT_SID=your_twilio_account_sid
NEXT_PUBLIC_TWILIO_API_KEY_SID=your_twilio_api_key_sid
NEXT_PUBLIC_TWILIO_FROM_NUMBER=+1234567890
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_API_KEY_SECRET=your_twilio_api_key_secret

## =============================================================================
## WEB3 / BLOCKCHAIN
## =============================================================================
NEXT_PUBLIC_DEFAULT_CHAIN=polygon
NEXT_PUBLIC_INFURA_ID=your_infura_project_id
NEXT_PUBLIC_ALCHEMY_ID=your_alchemy_api_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

## Contract Addresses (Polygon Mainnet)
NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_DAO_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...

## =============================================================================
## ANALYTICS
## =============================================================================
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_MIXPANEL_TOKEN=your_mixpanel_token
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_HOTJAR_ID=1234567

## =============================================================================
## FEATURE FLAGS
## =============================================================================
NEXT_PUBLIC_ENABLE_BLOCKCHAIN=true
NEXT_PUBLIC_ENABLE_VIDEO_CALL=true
NEXT_PUBLIC_ENABLE_DOCUSIGN=true
NEXT_PUBLIC_ENABLE_VASTU=true
NEXT_PUBLIC_ENABLE_CLIMATE=false
NEXT_PUBLIC_ENABLE_CHAT=true
NEXT_PUBLIC_ENABLE_PUSH=false
NEXT_PUBLIC_MAINTENANCE_MODE=false

## =============================================================================
## FILE UPLOADS
## =============================================================================
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_MAX_FILES=10
NEXT_PUBLIC_CDN_URL=https://cdn.dharmarealty.in
NEXT_PUBLIC_S3_BUCKET=dharma-realty-uploads

## AWS S3 Configuration (Server-side only)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1

## =============================================================================
## PAGINATION
## =============================================================================
NEXT_PUBLIC_DEFAULT_PAGE_SIZE=12
NEXT_PUBLIC_MAX_PAGE_SIZE=50

## =============================================================================
## CACHE
## =============================================================================
NEXT_PUBLIC_PROPERTY_LIST_TTL=300
NEXT_PUBLIC_PROPERTY_DETAIL_TTL=600
NEXT_PUBLIC_AGENT_LIST_TTL=600
NEXT_PUBLIC_SEARCH_TTL=60

## =============================================================================
## SOCIAL LINKS
## =============================================================================
NEXT_PUBLIC_FACEBOOK_URL=https://facebook.com/dharmarealty
NEXT_PUBLIC_TWITTER_URL=https://twitter.com/dharmarealty
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/dharmarealty
NEXT_PUBLIC_LINKEDIN_URL=https://linkedin.com/company/dharmarealty
NEXT_PUBLIC_YOUTUBE_URL=https://youtube.com/@dharmarealty

## =============================================================================
## CONTACT INFORMATION
## =============================================================================
NEXT_PUBLIC_CONTACT_EMAIL=contact@dharmarealty.in
NEXT_PUBLIC_CONTACT_PHONE=+91 22 1234 5678
NEXT_PUBLIC_WHATSAPP=+919876543210
NEXT_PUBLIC_ADDRESS=Dharma Tower, Bandra Kurla Complex, Mumbai 400051

## =============================================================================
## EMAIL SERVICE (Server-side only)
## =============================================================================
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@dharmarealty.in

## =============================================================================
## REDIS CACHE (Server-side only)
## =============================================================================
REDIS_URL=redis://localhost:6379

## =============================================================================
## DATABASE (Server-side only - Backend)
## =============================================================================
DATABASE_URL=postgresql://user:password@localhost:5432/dharma_realty

## =============================================================================
## JWT SECRETS (Server-side only - Backend)
## =============================================================================
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars
JWT_REFRESH_SECRET=your_super_secret_refresh_key_at_least_32_chars

## =============================================================================
## RATE LIMITING
## =============================================================================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
Env.d Â· TS

// TypeScript declarations for environment variables
// This provides type safety and autocomplete for process.env

declare namespace NodeJS {
  interface ProcessEnv {
    // Application
    NODE_ENV: 'development' | 'production' | 'test';
    NEXT_PUBLIC_APP_VERSION: string;
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_OG_IMAGE: string;

    // API Configuration
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_WS_URL: string;
    NEXT_PUBLIC_API_TIMEOUT: string;
    NEXT_PUBLIC_API_RETRY_ATTEMPTS: string;

    // Google Maps
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
    NEXT_PUBLIC_DEFAULT_LAT: string;
    NEXT_PUBLIC_DEFAULT_LNG: string;
    NEXT_PUBLIC_DEFAULT_ZOOM: string;

    // Stripe
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PUBLIC_DEFAULT_CURRENCY: string;
    NEXT_PUBLIC_STRIPE_LOCALE: string;

    // DocuSign
    NEXT_PUBLIC_DOCUSIGN_INTEGRATION_KEY: string;
    NEXT_PUBLIC_DOCUSIGN_ACCOUNT_ID: string;
    NEXT_PUBLIC_DOCUSIGN_BASE_URL: string;
    NEXT_PUBLIC_DOCUSIGN_OAUTH_URL: string;
    NEXT_PUBLIC_DOCUSIGN_REDIRECT_URI: string;
    DOCUSIGN_SECRET_KEY: string;
    DOCUSIGN_PRIVATE_KEY: string;

    // Twilio
    NEXT_PUBLIC_TWILIO_ACCOUNT_SID: string;
    NEXT_PUBLIC_TWILIO_API_KEY_SID: string;
    NEXT_PUBLIC_TWILIO_FROM_NUMBER: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_API_KEY_SECRET: string;

    // Web3
    NEXT_PUBLIC_DEFAULT_CHAIN: string;
    NEXT_PUBLIC_INFURA_ID: string;
    NEXT_PUBLIC_ALCHEMY_ID: string;
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: string;
    NEXT_PUBLIC_PROPERTY_TOKEN_ADDRESS: string;
    NEXT_PUBLIC_DAO_ADDRESS: string;
    NEXT_PUBLIC_MARKETPLACE_ADDRESS: string;

    // Analytics
    NEXT_PUBLIC_GA_ID: string;
    NEXT_PUBLIC_MIXPANEL_TOKEN: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_HOTJAR_ID: string;

    // Feature Flags
    NEXT_PUBLIC_ENABLE_BLOCKCHAIN: string;
    NEXT_PUBLIC_ENABLE_VIDEO_CALL: string;
    NEXT_PUBLIC_ENABLE_DOCUSIGN: string;
    NEXT_PUBLIC_ENABLE_VASTU: string;
    NEXT_PUBLIC_ENABLE_CLIMATE: string;
    NEXT_PUBLIC_ENABLE_CHAT: string;
    NEXT_PUBLIC_ENABLE_PUSH: string;
    NEXT_PUBLIC_MAINTENANCE_MODE: string;

    // File Uploads
    NEXT_PUBLIC_MAX_FILE_SIZE: string;
    NEXT_PUBLIC_MAX_FILES: string;
    NEXT_PUBLIC_CDN_URL: string;
    NEXT_PUBLIC_S3_BUCKET: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    AWS_REGION: string;

    // Pagination
    NEXT_PUBLIC_DEFAULT_PAGE_SIZE: string;
    NEXT_PUBLIC_MAX_PAGE_SIZE: string;

    // Cache
    NEXT_PUBLIC_PROPERTY_LIST_TTL: string;
    NEXT_PUBLIC_PROPERTY_DETAIL_TTL: string;
    NEXT_PUBLIC_AGENT_LIST_TTL: string;
    NEXT_PUBLIC_SEARCH_TTL: string;

    // Social Links
    NEXT_PUBLIC_FACEBOOK_URL: string;
    NEXT_PUBLIC_TWITTER_URL: string;
    NEXT_PUBLIC_INSTAGRAM_URL: string;
    NEXT_PUBLIC_LINKEDIN_URL: string;
    NEXT_PUBLIC_YOUTUBE_URL: string;

    // Contact
    NEXT_PUBLIC_CONTACT_EMAIL: string;
    NEXT_PUBLIC_CONTACT_PHONE: string;
    NEXT_PUBLIC_WHATSAPP: string;
    NEXT_PUBLIC_ADDRESS: string;

    // Email
    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_USER: string;
    SMTP_PASSWORD: string;
    EMAIL_FROM: string;

    // Redis
    REDIS_URL: string;

    // Database
    DATABASE_URL: string;

    // JWT
    JWT_SECRET: string;
    JWT_REFRESH_SECRET: string;

    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: string;
    RATE_LIMIT_MAX_REQUESTS: string;
  }
}















bash
mkdir -p /home/claude/dharma-realty/frontend/src/store
Auth store Â· TS
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { User } from '@/types';

// ============================================================================
// Types
// ============================================================================

export interface AuthState {
  // State
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  
  // Auth operations
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshSession: (accessToken: string, refreshToken?: string) => void;
  
  // Computed helpers
  hasRole: (role: string) => boolean;
  hasPermission: (permission: string) => boolean;
  isAgent: () => boolean;
  isAdmin: () => boolean;
}

// ============================================================================
// Role and Permission Definitions
// ============================================================================

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: [
    'manage:users',
    'manage:properties',
    'manage:agents',
    'manage:subscriptions',
    'manage:settings',
    'view:analytics',
    'view:reports',
    'moderate:content',
  ],
  agent: [
    'manage:own_properties',
    'manage:own_clients',
    'view:own_analytics',
    'create:listings',
    'schedule:viewings',
    'manage:documents',
  ],
  user: [
    'view:properties',
    'save:favorites',
    'create:inquiries',
    'schedule:viewings',
    'manage:profile',
    'manage:documents',
  ],
};

// ============================================================================
// Store
// ============================================================================

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: false,
      error: null,

      // Basic setters
      setUser: (user) =>
        set((state) => {
          state.user = user;
          state.isAuthenticated = !!user;
        }),

      setTokens: (accessToken, refreshToken) =>
        set((state) => {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
        }),

      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error) =>
        set((state) => {
          state.error = error;
        }),

      setInitialized: (initialized) =>
        set((state) => {
          state.isInitialized = initialized;
        }),

      // Auth operations
      login: (user, accessToken, refreshToken) =>
        set((state) => {
          state.user = user;
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        }),

      logout: () =>
        set((state) => {
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        }),

      updateUser: (updates) =>
        set((state) => {
          if (state.user) {
            state.user = { ...state.user, ...updates };
          }
        }),

      refreshSession: (accessToken, refreshToken) =>
        set((state) => {
          state.accessToken = accessToken;
          if (refreshToken) {
            state.refreshToken = refreshToken;
          }
        }),

      // Computed helpers
      hasRole: (role) => {
        const { user } = get();
        if (!user) return false;
        return user.role === role;
      },

      hasPermission: (permission) => {
        const { user } = get();
        if (!user) return false;
        const permissions = ROLE_PERMISSIONS[user.role] || [];
        return permissions.includes(permission);
      },

      isAgent: () => {
        const { user } = get();
        return user?.role === 'agent';
      },

      isAdmin: () => {
        const { user } = get();
        return user?.role === 'admin';
      },
    })),
    {
      name: 'dharma-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
export const selectIsLoading = (state: AuthState) => state.isLoading;
export const selectAuthError = (state: AuthState) => state.error;
export const selectAccessToken = (state: AuthState) => state.accessToken;

// ============================================================================
// Hooks
// ============================================================================

export const useUser = () => useAuthStore(selectUser);
export const useIsAuthenticated = () => useAuthStore(selectIsAuthenticated);
export const useAuthLoading = () => useAuthStore(selectIsLoading);
export const useAuthError = () => useAuthStore(selectAuthError);
Property store Â· TS
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// Types
// ============================================================================

export interface PropertyFilters {
  type?: string[];
  status?: string[];
  priceMin?: number;
  priceMax?: number;
  areaMin?: number;
  areaMax?: number;
  bedrooms?: number[];
  bathrooms?: number[];
  amenities?: string[];
  vastuScore?: number;
  location?: {
    city?: string;
    locality?: string;
    lat?: number;
    lng?: number;
    radius?: number;
  };
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RecentSearch {
  id: string;
  query: string;
  filters: PropertyFilters;
  timestamp: number;
  resultsCount: number;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: PropertyFilters;
  alertEnabled: boolean;
  createdAt: number;
}

export interface PropertyState {
  // Favorites
  favorites: string[];
  
  // Comparison
  compareList: string[];
  maxCompareItems: number;
  
  // Recently viewed
  recentlyViewed: string[];
  maxRecentItems: number;
  
  // Search
  currentFilters: PropertyFilters;
  recentSearches: RecentSearch[];
  savedSearches: SavedSearch[];
  maxRecentSearches: number;
  
  // View preferences
  viewMode: 'grid' | 'list' | 'map';
  mapCenter: { lat: number; lng: number } | null;
  mapZoom: number;
  
  // Actions - Favorites
  addFavorite: (propertyId: string) => void;
  removeFavorite: (propertyId: string) => void;
  toggleFavorite: (propertyId: string) => void;
  clearFavorites: () => void;
  isFavorite: (propertyId: string) => boolean;
  
  // Actions - Compare
  addToCompare: (propertyId: string) => boolean;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  canAddToCompare: () => boolean;
  
  // Actions - Recently Viewed
  addToRecentlyViewed: (propertyId: string) => void;
  clearRecentlyViewed: () => void;
  
  // Actions - Filters
  setFilters: (filters: PropertyFilters) => void;
  updateFilter: <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => void;
  clearFilters: () => void;
  hasActiveFilters: () => boolean;
  getActiveFilterCount: () => number;
  
  // Actions - Recent Searches
  addRecentSearch: (search: Omit<RecentSearch, 'id' | 'timestamp'>) => void;
  clearRecentSearches: () => void;
  
  // Actions - Saved Searches
  saveSearch: (name: string, alertEnabled?: boolean) => string;
  deleteSavedSearch: (id: string) => void;
  updateSavedSearch: (id: string, updates: Partial<SavedSearch>) => void;
  loadSavedSearch: (id: string) => void;
  
  // Actions - View
  setViewMode: (mode: 'grid' | 'list' | 'map') => void;
  setMapCenter: (center: { lat: number; lng: number } | null) => void;
  setMapZoom: (zoom: number) => void;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_FILTERS: PropertyFilters = {
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

const DEFAULT_MAP_CENTER = { lat: 19.076, lng: 72.8777 }; // Mumbai
const DEFAULT_MAP_ZOOM = 12;

// ============================================================================
// Helper Functions
// ============================================================================

const generateId = () => Math.random().toString(36).substring(2, 11);

// ============================================================================
// Store
// ============================================================================

export const usePropertyStore = create<PropertyState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      favorites: [],
      compareList: [],
      maxCompareItems: 4,
      recentlyViewed: [],
      maxRecentItems: 20,
      currentFilters: DEFAULT_FILTERS,
      recentSearches: [],
      savedSearches: [],
      maxRecentSearches: 10,
      viewMode: 'grid',
      mapCenter: null,
      mapZoom: DEFAULT_MAP_ZOOM,

      // Favorites
      addFavorite: (propertyId) =>
        set((state) => {
          if (!state.favorites.includes(propertyId)) {
            state.favorites.push(propertyId);
          }
        }),

      removeFavorite: (propertyId) =>
        set((state) => {
          state.favorites = state.favorites.filter((id) => id !== propertyId);
        }),

      toggleFavorite: (propertyId) =>
        set((state) => {
          const index = state.favorites.indexOf(propertyId);
          if (index === -1) {
            state.favorites.push(propertyId);
          } else {
            state.favorites.splice(index, 1);
          }
        }),

      clearFavorites: () =>
        set((state) => {
          state.favorites = [];
        }),

      isFavorite: (propertyId) => {
        return get().favorites.includes(propertyId);
      },

      // Compare
      addToCompare: (propertyId) => {
        const state = get();
        if (state.compareList.length >= state.maxCompareItems) {
          return false;
        }
        if (state.compareList.includes(propertyId)) {
          return true;
        }
        set((state) => {
          state.compareList.push(propertyId);
        });
        return true;
      },

      removeFromCompare: (propertyId) =>
        set((state) => {
          state.compareList = state.compareList.filter((id) => id !== propertyId);
        }),

      clearCompare: () =>
        set((state) => {
          state.compareList = [];
        }),

      isInCompare: (propertyId) => {
        return get().compareList.includes(propertyId);
      },

      canAddToCompare: () => {
        const state = get();
        return state.compareList.length < state.maxCompareItems;
      },

      // Recently Viewed
      addToRecentlyViewed: (propertyId) =>
        set((state) => {
          // Remove if already exists
          state.recentlyViewed = state.recentlyViewed.filter((id) => id !== propertyId);
          // Add to beginning
          state.recentlyViewed.unshift(propertyId);
          // Trim to max items
          if (state.recentlyViewed.length > state.maxRecentItems) {
            state.recentlyViewed = state.recentlyViewed.slice(0, state.maxRecentItems);
          }
        }),

      clearRecentlyViewed: () =>
        set((state) => {
          state.recentlyViewed = [];
        }),

      // Filters
      setFilters: (filters) =>
        set((state) => {
          state.currentFilters = { ...DEFAULT_FILTERS, ...filters };
        }),

      updateFilter: (key, value) =>
        set((state) => {
          state.currentFilters[key] = value;
        }),

      clearFilters: () =>
        set((state) => {
          state.currentFilters = DEFAULT_FILTERS;
        }),

      hasActiveFilters: () => {
        const { currentFilters } = get();
        const filterKeys = Object.keys(currentFilters).filter(
          (key) => key !== 'sortBy' && key !== 'sortOrder'
        );
        return filterKeys.some((key) => {
          const value = currentFilters[key as keyof PropertyFilters];
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === 'object' && value !== null) {
            return Object.values(value).some((v) => v !== undefined);
          }
          return value !== undefined;
        });
      },

      getActiveFilterCount: () => {
        const { currentFilters } = get();
        let count = 0;
        
        if (currentFilters.type?.length) count++;
        if (currentFilters.status?.length) count++;
        if (currentFilters.priceMin || currentFilters.priceMax) count++;
        if (currentFilters.areaMin || currentFilters.areaMax) count++;
        if (currentFilters.bedrooms?.length) count++;
        if (currentFilters.bathrooms?.length) count++;
        if (currentFilters.amenities?.length) count++;
        if (currentFilters.vastuScore) count++;
        if (currentFilters.location?.city || currentFilters.location?.locality) count++;
        
        return count;
      },

      // Recent Searches
      addRecentSearch: (search) =>
        set((state) => {
          const newSearch: RecentSearch = {
            ...search,
            id: generateId(),
            timestamp: Date.now(),
          };
          
          // Remove duplicate queries
          state.recentSearches = state.recentSearches.filter(
            (s) => s.query !== search.query
          );
          
          // Add to beginning
          state.recentSearches.unshift(newSearch);
          
          // Trim to max
          if (state.recentSearches.length > state.maxRecentSearches) {
            state.recentSearches = state.recentSearches.slice(0, state.maxRecentSearches);
          }
        }),

      clearRecentSearches: () =>
        set((state) => {
          state.recentSearches = [];
        }),

      // Saved Searches
      saveSearch: (name, alertEnabled = false) => {
        const id = generateId();
        set((state) => {
          state.savedSearches.push({
            id,
            name,
            filters: { ...state.currentFilters },
            alertEnabled,
            createdAt: Date.now(),
          });
        });
        return id;
      },

      deleteSavedSearch: (id) =>
        set((state) => {
          state.savedSearches = state.savedSearches.filter((s) => s.id !== id);
        }),

      updateSavedSearch: (id, updates) =>
        set((state) => {
          const index = state.savedSearches.findIndex((s) => s.id === id);
          if (index !== -1) {
            state.savedSearches[index] = { ...state.savedSearches[index], ...updates };
          }
        }),

      loadSavedSearch: (id) =>
        set((state) => {
          const search = state.savedSearches.find((s) => s.id === id);
          if (search) {
            state.currentFilters = { ...search.filters };
          }
        }),

      // View
      setViewMode: (mode) =>
        set((state) => {
          state.viewMode = mode;
        }),

      setMapCenter: (center) =>
        set((state) => {
          state.mapCenter = center;
        }),

      setMapZoom: (zoom) =>
        set((state) => {
          state.mapZoom = zoom;
        }),
    })),
    {
      name: 'dharma-property',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        compareList: state.compareList,
        recentlyViewed: state.recentlyViewed,
        savedSearches: state.savedSearches,
        viewMode: state.viewMode,
      }),
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectFavorites = (state: PropertyState) => state.favorites;
export const selectCompareList = (state: PropertyState) => state.compareList;
export const selectRecentlyViewed = (state: PropertyState) => state.recentlyViewed;
export const selectCurrentFilters = (state: PropertyState) => state.currentFilters;
export const selectViewMode = (state: PropertyState) => state.viewMode;
export const selectSavedSearches = (state: PropertyState) => state.savedSearches;

// ============================================================================
// Hooks
// ============================================================================

export const useFavorites = () => usePropertyStore(selectFavorites);
export const useCompareList = () => usePropertyStore(selectCompareList);
export const useRecentlyViewed = () => usePropertyStore(selectRecentlyViewed);
export const useCurrentFilters = () => usePropertyStore(selectCurrentFilters);
export const useViewMode = () => usePropertyStore(selectViewMode);
export const useSavedSearches = () => usePropertyStore(selectSavedSearches);
Ui store Â· TS
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ReactNode } from 'react';

// ============================================================================
// Types
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ModalConfig {
  id: string;
  title?: string;
  content: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export interface ConfirmDialogConfig {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

export interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  
  // Mobile menu
  mobileMenuOpen: boolean;
  
  // Modals
  modals: ModalConfig[];
  confirmDialog: ConfirmDialogConfig | null;
  
  // Toasts
  toasts: Toast[];
  
  // Loading states
  globalLoading: boolean;
  loadingMessage: string | null;
  
  // Search
  searchOpen: boolean;
  searchQuery: string;
  
  // Scroll
  scrollLocked: boolean;
  scrollPosition: number;
  
  // Theme (if not using next-themes)
  theme: 'light' | 'dark' | 'system';
  
  // Actions - Sidebar
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Actions - Mobile Menu
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Actions - Modals
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id?: string) => void;
  closeAllModals: () => void;
  
  // Actions - Confirm Dialog
  showConfirm: (config: ConfirmDialogConfig) => void;
  hideConfirm: () => void;
  
  // Actions - Toasts
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Convenience toast methods
  toast: {
    success: (title: string, message?: string) => string;
    error: (title: string, message?: string) => string;
    warning: (title: string, message?: string) => string;
    info: (title: string, message?: string) => string;
  };
  
  // Actions - Loading
  setGlobalLoading: (loading: boolean, message?: string) => void;
  
  // Actions - Search
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  
  // Actions - Scroll
  lockScroll: () => void;
  unlockScroll: () => void;
  setScrollPosition: (position: number) => void;
  
  // Actions - Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

// ============================================================================
// Helper Functions
// ============================================================================

const generateId = () => Math.random().toString(36).substring(2, 11);

// ============================================================================
// Store
// ============================================================================

export const useUIStore = create<UIState>()(
  immer((set, get) => ({
    // Initial state
    sidebarOpen: true,
    sidebarCollapsed: false,
    mobileMenuOpen: false,
    modals: [],
    confirmDialog: null,
    toasts: [],
    globalLoading: false,
    loadingMessage: null,
    searchOpen: false,
    searchQuery: '',
    scrollLocked: false,
    scrollPosition: 0,
    theme: 'system',

    // Sidebar
    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),

    setSidebarOpen: (open) =>
      set((state) => {
        state.sidebarOpen = open;
      }),

    toggleSidebarCollapse: () =>
      set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
      }),

    setSidebarCollapsed: (collapsed) =>
      set((state) => {
        state.sidebarCollapsed = collapsed;
      }),

    // Mobile Menu
    toggleMobileMenu: () =>
      set((state) => {
        state.mobileMenuOpen = !state.mobileMenuOpen;
      }),

    setMobileMenuOpen: (open) =>
      set((state) => {
        state.mobileMenuOpen = open;
      }),

    // Modals
    openModal: (config) => {
      const id = generateId();
      set((state) => {
        state.modals.push({ ...config, id });
        state.scrollLocked = true;
      });
      return id;
    },

    closeModal: (id) =>
      set((state) => {
        if (id) {
          const modal = state.modals.find((m) => m.id === id);
          modal?.onClose?.();
          state.modals = state.modals.filter((m) => m.id !== id);
        } else if (state.modals.length > 0) {
          const lastModal = state.modals[state.modals.length - 1];
          lastModal?.onClose?.();
          state.modals.pop();
        }
        if (state.modals.length === 0) {
          state.scrollLocked = false;
        }
      }),

    closeAllModals: () =>
      set((state) => {
        state.modals.forEach((m) => m.onClose?.());
        state.modals = [];
        state.scrollLocked = false;
      }),

    // Confirm Dialog
    showConfirm: (config) =>
      set((state) => {
        state.confirmDialog = config;
      }),

    hideConfirm: () =>
      set((state) => {
        state.confirmDialog = null;
      }),

    // Toasts
    addToast: (toast) => {
      const id = generateId();
      const duration = toast.duration ?? 5000;
      
      set((state) => {
        state.toasts.push({ ...toast, id });
      });

      // Auto-remove after duration
      if (duration > 0) {
        setTimeout(() => {
          get().removeToast(id);
        }, duration);
      }

      return id;
    },

    removeToast: (id) =>
      set((state) => {
        state.toasts = state.toasts.filter((t) => t.id !== id);
      }),

    clearToasts: () =>
      set((state) => {
        state.toasts = [];
      }),

    // Convenience toast methods
    toast: {
      success: (title, message) => {
        return get().addToast({ type: 'success', title, message });
      },
      error: (title, message) => {
        return get().addToast({ type: 'error', title, message, duration: 8000 });
      },
      warning: (title, message) => {
        return get().addToast({ type: 'warning', title, message });
      },
      info: (title, message) => {
        return get().addToast({ type: 'info', title, message });
      },
    },

    // Loading
    setGlobalLoading: (loading, message) =>
      set((state) => {
        state.globalLoading = loading;
        state.loadingMessage = loading ? (message ?? null) : null;
      }),

    // Search
    toggleSearch: () =>
      set((state) => {
        state.searchOpen = !state.searchOpen;
        if (!state.searchOpen) {
          state.searchQuery = '';
        }
      }),

    setSearchOpen: (open) =>
      set((state) => {
        state.searchOpen = open;
        if (!open) {
          state.searchQuery = '';
        }
      }),

    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),

    // Scroll
    lockScroll: () =>
      set((state) => {
        if (!state.scrollLocked && typeof window !== 'undefined') {
          state.scrollPosition = window.scrollY;
          document.body.style.overflow = 'hidden';
          document.body.style.position = 'fixed';
          document.body.style.top = `-${state.scrollPosition}px`;
          document.body.style.width = '100%';
        }
        state.scrollLocked = true;
      }),

    unlockScroll: () =>
      set((state) => {
        if (state.scrollLocked && typeof window !== 'undefined') {
          document.body.style.overflow = '';
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.width = '';
          window.scrollTo(0, state.scrollPosition);
        }
        state.scrollLocked = false;
      }),

    setScrollPosition: (position) =>
      set((state) => {
        state.scrollPosition = position;
      }),

    // Theme
    setTheme: (theme) =>
      set((state) => {
        state.theme = theme;
      }),
  }))
);

// ============================================================================
// Selectors
// ============================================================================

export const selectSidebarOpen = (state: UIState) => state.sidebarOpen;
export const selectSidebarCollapsed = (state: UIState) => state.sidebarCollapsed;
export const selectMobileMenuOpen = (state: UIState) => state.mobileMenuOpen;
export const selectModals = (state: UIState) => state.modals;
export const selectConfirmDialog = (state: UIState) => state.confirmDialog;
export const selectToasts = (state: UIState) => state.toasts;
export const selectGlobalLoading = (state: UIState) => state.globalLoading;
export const selectSearchOpen = (state: UIState) => state.searchOpen;
export const selectSearchQuery = (state: UIState) => state.searchQuery;
export const selectTheme = (state: UIState) => state.theme;

// ============================================================================
// Hooks
// ============================================================================

export const useSidebarOpen = () => useUIStore(selectSidebarOpen);
export const useSidebarCollapsed = () => useUIStore(selectSidebarCollapsed);
export const useMobileMenuOpen = () => useUIStore(selectMobileMenuOpen);
export const useModals = () => useUIStore(selectModals);
export const useConfirmDialog = () => useUIStore(selectConfirmDialog);
export const useToasts = () => useUIStore(selectToasts);
export const useGlobalLoading = () => useUIStore(selectGlobalLoading);
export const useSearchOpen = () => useUIStore(selectSearchOpen);
export const useSearchQuery = () => useUIStore(selectSearchQuery);

// Convenience hook for toast
export const useToast = () => {
  const store = useUIStore();
  return store.toast;
};
Notification store Â· TS
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// ============================================================================
// Types
// ============================================================================

export type NotificationType = 
  | 'property_inquiry'
  | 'property_update'
  | 'viewing_scheduled'
  | 'viewing_reminder'
  | 'document_signed'
  | 'document_pending'
  | 'payment_received'
  | 'payment_failed'
  | 'message_received'
  | 'offer_received'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'price_drop'
  | 'new_listing'
  | 'saved_search_match'
  | 'system'
  | 'promotion';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
  actionUrl?: string;
  actionLabel?: string;
  imageUrl?: string;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
    types: NotificationType[];
  };
  push: {
    enabled: boolean;
    types: NotificationType[];
  };
  sms: {
    enabled: boolean;
    types: NotificationType[];
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    types: NotificationType[];
  };
}

export interface NotificationState {
  // State
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  lastFetched: number | null;
  
  // Preferences
  preferences: NotificationPreferences;
  
  // Connection state
  connected: boolean;
  
  // Actions - Notifications
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  addNotifications: (notifications: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  markMultipleAsRead: (ids: string[]) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  clearReadNotifications: () => void;
  
  // Actions - Loading
  setLoading: (loading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setLastFetched: (timestamp: number) => void;
  
  // Actions - Preferences
  setPreferences: (preferences: NotificationPreferences) => void;
  updateEmailPreferences: (updates: Partial<NotificationPreferences['email']>) => void;
  updatePushPreferences: (updates: Partial<NotificationPreferences['push']>) => void;
  updateSmsPreferences: (updates: Partial<NotificationPreferences['sms']>) => void;
  updateInAppPreferences: (updates: Partial<NotificationPreferences['inApp']>) => void;
  toggleNotificationType: (channel: keyof NotificationPreferences, type: NotificationType) => void;
  
  // Actions - Connection
  setConnected: (connected: boolean) => void;
  
  // Computed
  getUnreadNotifications: () => Notification[];
  getNotificationsByType: (type: NotificationType) => Notification[];
  getHighPriorityNotifications: () => Notification[];
}

// ============================================================================
// Default Values
// ============================================================================

const ALL_NOTIFICATION_TYPES: NotificationType[] = [
  'property_inquiry',
  'property_update',
  'viewing_scheduled',
  'viewing_reminder',
  'document_signed',
  'document_pending',
  'payment_received',
  'payment_failed',
  'message_received',
  'offer_received',
  'offer_accepted',
  'offer_rejected',
  'price_drop',
  'new_listing',
  'saved_search_match',
  'system',
  'promotion',
];

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: {
    enabled: true,
    frequency: 'instant',
    types: [
      'viewing_scheduled',
      'document_signed',
      'document_pending',
      'payment_received',
      'payment_failed',
      'offer_received',
      'offer_accepted',
      'offer_rejected',
    ],
  },
  push: {
    enabled: true,
    types: [
      'message_received',
      'viewing_reminder',
      'document_pending',
      'offer_received',
    ],
  },
  sms: {
    enabled: false,
    types: [
      'viewing_reminder',
      'payment_failed',
    ],
  },
  inApp: {
    enabled: true,
    sound: true,
    desktop: true,
    types: ALL_NOTIFICATION_TYPES,
  },
};

// ============================================================================
// Store
// ============================================================================

export const useNotificationStore = create<NotificationState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      hasMore: true,
      lastFetched: null,
      preferences: DEFAULT_PREFERENCES,
      connected: false,

      // Notifications
      setNotifications: (notifications) =>
        set((state) => {
          state.notifications = notifications;
          state.unreadCount = notifications.filter((n) => !n.read).length;
        }),

      addNotification: (notification) =>
        set((state) => {
          // Check for duplicates
          if (!state.notifications.some((n) => n.id === notification.id)) {
            state.notifications.unshift(notification);
            if (!notification.read) {
              state.unreadCount++;
            }
          }
        }),

      addNotifications: (notifications) =>
        set((state) => {
          const existingIds = new Set(state.notifications.map((n) => n.id));
          const newNotifications = notifications.filter((n) => !existingIds.has(n.id));
          state.notifications = [...state.notifications, ...newNotifications];
          state.unreadCount = state.notifications.filter((n) => !n.read).length;
        }),

      markAsRead: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && !notification.read) {
            notification.read = true;
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }),

      markAllAsRead: () =>
        set((state) => {
          state.notifications.forEach((n) => {
            n.read = true;
          });
          state.unreadCount = 0;
        }),

      markMultipleAsRead: (ids) =>
        set((state) => {
          const idsSet = new Set(ids);
          state.notifications.forEach((n) => {
            if (idsSet.has(n.id) && !n.read) {
              n.read = true;
            }
          });
          state.unreadCount = state.notifications.filter((n) => !n.read).length;
        }),

      removeNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          if (notification && !notification.read) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
          state.notifications = state.notifications.filter((n) => n.id !== id);
        }),

      clearNotifications: () =>
        set((state) => {
          state.notifications = [];
          state.unreadCount = 0;
        }),

      clearReadNotifications: () =>
        set((state) => {
          state.notifications = state.notifications.filter((n) => !n.read);
        }),

      // Loading
      setLoading: (loading) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setHasMore: (hasMore) =>
        set((state) => {
          state.hasMore = hasMore;
        }),

      setLastFetched: (timestamp) =>
        set((state) => {
          state.lastFetched = timestamp;
        }),

      // Preferences
      setPreferences: (preferences) =>
        set((state) => {
          state.preferences = preferences;
        }),

      updateEmailPreferences: (updates) =>
        set((state) => {
          state.preferences.email = { ...state.preferences.email, ...updates };
        }),

      updatePushPreferences: (updates) =>
        set((state) => {
          state.preferences.push = { ...state.preferences.push, ...updates };
        }),

      updateSmsPreferences: (updates) =>
        set((state) => {
          state.preferences.sms = { ...state.preferences.sms, ...updates };
        }),

      updateInAppPreferences: (updates) =>
        set((state) => {
          state.preferences.inApp = { ...state.preferences.inApp, ...updates };
        }),

      toggleNotificationType: (channel, type) =>
        set((state) => {
          const types = state.preferences[channel].types;
          const index = types.indexOf(type);
          if (index === -1) {
            types.push(type);
          } else {
            types.splice(index, 1);
          }
        }),

      // Connection
      setConnected: (connected) =>
        set((state) => {
          state.connected = connected;
        }),

      // Computed
      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read);
      },

      getNotificationsByType: (type) => {
        return get().notifications.filter((n) => n.type === type);
      },

      getHighPriorityNotifications: () => {
        return get().notifications.filter(
          (n) => n.priority === 'high' || n.priority === 'urgent'
        );
      },
    })),
    {
      name: 'dharma-notifications',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        // Don't persist notifications - fetch fresh on load
      }),
    }
  )
);

// ============================================================================
// Selectors
// ============================================================================

export const selectNotifications = (state: NotificationState) => state.notifications;
export const selectUnreadCount = (state: NotificationState) => state.unreadCount;
export const selectIsLoading = (state: NotificationState) => state.isLoading;
export const selectPreferences = (state: NotificationState) => state.preferences;
export const selectConnected = (state: NotificationState) => state.connected;

// ============================================================================
// Hooks
// ============================================================================

export const useNotifications = () => useNotificationStore(selectNotifications);
export const useUnreadCount = () => useNotificationStore(selectUnreadCount);
export const useNotificationLoading = () => useNotificationStore(selectIsLoading);
export const useNotificationPreferences = () => useNotificationStore(selectPreferences);
export const useNotificationConnected = () => useNotificationStore(selectConnected);

// ============================================================================
// Helper Functions
// ============================================================================

export const getNotificationIcon = (type: NotificationType): string => {
  const icons: Record<NotificationType, string> = {
    property_inquiry: 'message-circle',
    property_update: 'home',
    viewing_scheduled: 'calendar',
    viewing_reminder: 'bell',
    document_signed: 'check-circle',
    document_pending: 'file-text',
    payment_received: 'credit-card',
    payment_failed: 'alert-circle',
    message_received: 'message-square',
    offer_received: 'tag',
    offer_accepted: 'check',
    offer_rejected: 'x',
    price_drop: 'trending-down',
    new_listing: 'plus-circle',
    saved_search_match: 'search',
    system: 'info',
    promotion: 'gift',
  };
  return icons[type] || 'bell';
};

export const getNotificationColor = (type: NotificationType): string => {
  const colors: Record<NotificationType, string> = {
    property_inquiry: 'blue',
    property_update: 'indigo',
    viewing_scheduled: 'green',
    viewing_reminder: 'yellow',
    document_signed: 'green',
    document_pending: 'orange',
    payment_received: 'green',
    payment_failed: 'red',
    message_received: 'blue',
    offer_received: 'purple',
    offer_accepted: 'green',
    offer_rejected: 'red',
    price_drop: 'green',
    new_listing: 'blue',
    saved_search_match: 'indigo',
    system: 'gray',
    promotion: 'pink',
  };
  return colors[type] || 'gray';
};

export const getNotificationTypeLabel = (type: NotificationType): string => {
  const labels: Record<NotificationType, string> = {
    property_inquiry: 'Property Inquiry',
    property_update: 'Property Update',
    viewing_scheduled: 'Viewing Scheduled',
    viewing_reminder: 'Viewing Reminder',
    document_signed: 'Document Signed',
    document_pending: 'Document Pending',
    payment_received: 'Payment Received',
    payment_failed: 'Payment Failed',
    message_received: 'Message Received',
    offer_received: 'Offer Received',
    offer_accepted: 'Offer Accepted',
    offer_rejected: 'Offer Rejected',
    price_drop: 'Price Drop',
    new_listing: 'New Listing',
    saved_search_match: 'Search Match',
    system: 'System',
    promotion: 'Promotion',
  };
  return labels[type] || type;
};

Index Â· TS
// ============================================================================
// Dharma Realty - State Management (Zustand Stores)
// ============================================================================

// Auth Store
export {
  useAuthStore,
  selectUser,
  selectIsAuthenticated,
  selectIsLoading as selectAuthLoading,
  selectAuthError,
  selectAccessToken,
  useUser,
  useIsAuthenticated,
  useAuthLoading,
  useAuthError,
  type AuthState,
} from './auth-store';

// Property Store
export {
  usePropertyStore,
  selectFavorites,
  selectCompareList,
  selectRecentlyViewed,
  selectCurrentFilters,
  selectViewMode,
  selectSavedSearches,
  useFavorites,
  useCompareList,
  useRecentlyViewed,
  useCurrentFilters,
  useViewMode,
  useSavedSearches,
  type PropertyState,
  type PropertyFilters,
  type RecentSearch,
  type SavedSearch,
} from './property-store';

// UI Store
export {
  useUIStore,
  selectSidebarOpen,
  selectSidebarCollapsed,
  selectMobileMenuOpen,
  selectModals,
  selectConfirmDialog,
  selectToasts,
  selectGlobalLoading,
  selectSearchOpen,
  selectSearchQuery,
  selectTheme,
  useSidebarOpen,
  useSidebarCollapsed,
  useMobileMenuOpen,
  useModals,
  useConfirmDialog,
  useToasts,
  useGlobalLoading,
  useSearchOpen,
  useSearchQuery,
  useToast,
  type UIState,
  type Toast,
  type ToastType,
  type ModalConfig,
  type ConfirmDialogConfig,
} from './ui-store';

// Notification Store
export {
  useNotificationStore,
  selectNotifications,
  selectUnreadCount,
  selectIsLoading as selectNotificationLoading,
  selectPreferences,
  selectConnected,
  useNotifications,
  useUnreadCount,
  useNotificationLoading,
  useNotificationPreferences,
  useNotificationConnected,
  getNotificationIcon,
  getNotificationColor,
  getNotificationTypeLabel,
  type NotificationState,
  type Notification,
  type NotificationType,
  type NotificationPriority,
  type NotificationPreferences,
} from './notification-store';
