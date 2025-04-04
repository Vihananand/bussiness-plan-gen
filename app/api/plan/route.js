import { NextResponse } from "next/server";

// This is a simple GET endpoint that returns the saved business plan
// In a real application, this would fetch from a database
// For now, we'll use a dummy plan or fetch from session/localStorage via cookies

// Use a more persistent cache approach for Next.js
let savedPlan = global.savedPlan || null;

// Save plan to global object to persist between API calls
function savePlanToGlobal(plan) {
  savedPlan = plan;
  global.savedPlan = plan;
  console.log('Plan saved to global:', plan.businessName);
  return savedPlan;
}

export async function GET() {
  try {
    // If no plan has been saved yet, return a 404
    if (!savedPlan) {
      console.log('No plan found to retrieve');
      return NextResponse.json(
        { error: 'No business plan has been saved yet' },
        { status: 404 }
      );
    }
    
    console.log('Retrieved saved plan:', savedPlan.businessName);
    return NextResponse.json(savedPlan);
  } catch (error) {
    console.error('Error retrieving plan:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve the business plan' },
      { status: 500 }
    );
  }
}

// This endpoint saves a business plan
export async function POST(request) {
  try {
    const plan = await request.json();
    
    // Simply save the raw plan data without structure validation or processing
    savePlanToGlobal(plan);
    
    console.log('Plan saved successfully:', plan.businessName);
    return NextResponse.json({ success: true, message: 'Business plan saved successfully' });
  } catch (error) {
    console.error('Error saving plan:', error);
    return NextResponse.json(
      { error: 'Failed to save the business plan' },
      { status: 500 }
    );
  }
} 