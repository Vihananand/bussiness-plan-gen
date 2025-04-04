import { NextResponse } from "next/server";

let savedPlan = global.savedPlan || null;

function savePlanToGlobal(plan) {
  savedPlan = plan;
  global.savedPlan = plan;
  console.log('Plan saved to global:', plan.businessName);
  return savedPlan;
}

export async function GET() {
  try {
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

export async function POST(request) {
  try {
    const plan = await request.json();
    
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