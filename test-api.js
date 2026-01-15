// Simple test to debug API call
const API_BASE = "http://localhost:8000/api/v1";

async function testAPI() {
  try {
    const response = await fetch(
      `${API_BASE}/properties?page=1&limit=12&includeAnalysis=true`,
    );
    const data = await response.json();
    console.log("Raw response:", data);

    // Test transformation
    const transformed = data.data?.data || data.data || data;
    console.log("Transformed:", transformed);
    console.log("Properties count:", transformed.properties?.length || 0);

    return transformed;
  } catch (error) {
    console.error("API test error:", error);
  }
}

testAPI();
