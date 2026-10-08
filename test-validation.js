// Test Zod validation behavior for string IDs
const { z } = require('zod');

// Test the schemas that were implemented
const mapIdSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Map ID must be a valid string")
});

const lineupIdSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Lineup ID must be a valid string")
});

console.log("Testing Zod validation schemas...");

// Test valid string IDs (should pass)
try {
  const validMapId = mapIdSchema.parse({ id: "dust2" });
  console.log("✓ Valid map ID 'dust2' accepted");
} catch (error) {
  console.log("✗ Valid map ID 'dust2' rejected:", error.message);
}

try {
  const validMapId = mapIdSchema.parse({ id: "de_mirage-2" });
  console.log("✓ Valid map ID 'de_mirage-2' accepted");
} catch (error) {
  console.log("✗ Valid map ID 'de_mirage-2' rejected:", error.message);
}

try {
  const validLineupId = lineupIdSchema.parse({ id: "smoke-123" });
  console.log("✓ Valid lineup ID 'smoke-123' accepted");
} catch (error) {
  console.log("✗ Valid lineup ID 'smoke-123' rejected:", error.message);
}

try {
  const validLineupId = lineupIdSchema.parse({ id: "flash-456-abc" });
  console.log("✓ Valid lineup ID 'flash-456-abc' accepted");
} catch (error) {
  console.log("✗ Valid lineup ID 'flash-456-abc' rejected:", error.message);
}

// Test invalid string IDs (should fail)
try {
  const invalidMapId = mapIdSchema.parse({ id: 123 });
  console.log("✗ Invalid map ID (number) incorrectly accepted");
} catch (error) {
  console.log("✓ Invalid map ID (number) correctly rejected");
}

try {
  const invalidMapId = mapIdSchema.parse({ id: "invalid@id" });
  console.log("✗ Invalid map ID with special chars incorrectly accepted");
} catch (error) {
  console.log("✓ Invalid map ID with special chars correctly rejected");
}

try {
  const invalidLineupId = lineupIdSchema.parse({ id: 456 });
  console.log("✗ Invalid lineup ID (number) incorrectly accepted");
} catch (error) {
  console.log("✓ Invalid lineup ID (number) correctly rejected");
}

console.log("\nZod validation test completed!");