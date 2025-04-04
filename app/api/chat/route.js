// Remove the SSL certificate bypass since we'll use Google's API which doesn't need it
// Remove: process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Google Generative AI with API key from environment variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Check if API key is available
if (!GOOGLE_API_KEY) {
	console.error("GOOGLE_API_KEY environment variable is not set");
}

let genAI;
let model;

try {
	genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
	model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
} catch (error) {
	console.error("Error initializing Google Generative AI:", error);
}

export async function POST(request) {
	try {
		const formData = await request.json();
		
		// If AI is not enabled, return a basic response
		if (!formData.useAI) {
			const basicResponse = createStructuredResponse(formData);
			return NextResponse.json(basicResponse);
		}
		
		// Check if API key is properly configured
		if (!GOOGLE_API_KEY) {
			console.error("GOOGLE_API_KEY environment variable is missing");
			return NextResponse.json({
				error: "API key not configured",
				message: "Server configuration error: API key not available"
			}, { status: 500 });
		}
		
		// Build the prompt for AI
		const prompt = `Create a detailed business plan for the following business:
		
Business Name: ${formData.businessName || "Not specified"}
Industry: ${formData.industry || "Not specified"}
Business Type: ${formData.businessType || "Not specified"}
Location: ${formData.location || "Not specified"}
Business Concept: ${formData.businessConcept || "Not specified"}
Target Market: ${formData.targetMarket || "Not specified"}
Unique Value Proposition: ${formData.uniqueValue || "Not specified"}
Initial Investment: ${formData.startupCosts || "Not specified"}
Expected Revenue: ${formData.expectedRevenue || "Not specified"}
Key Milestones: ${formData.keyMilestones || "Not specified"}

Provide a comprehensive business plan with the following sections. For each section, provide detailed and specific content:

1. EXECUTIVE SUMMARY
- Mission Statement: Provide a clear, concise statement of the company's purpose
- Vision Statement: Describe what the company aims to achieve in the long term
- Business Overview: Brief description of the business, its industry position, and goals

2. BUSINESS OVERVIEW
- Detailed Description: Comprehensive explanation of the business concept
- Problem Statement: Clear definition of the market problem being solved
- Solution: How your business solves this problem
- Target Market: Detailed profile of ideal customers
- Market Size: Quantify the total addressable market

3. PRODUCTS AND SERVICES
- Description: Detailed explanation of offerings
- Pricing Strategy: How products/services will be priced
- Distribution Channels: How offerings will reach customers

4. MARKET ANALYSIS
- Market Trends: Current and future industry trends
- Customer Segments: Detailed breakdown of customer types
- Competitive Landscape: Analysis of direct and indirect competitors

5. MARKETING STRATEGY
- Promotion Strategies: How the business will attract customers
- Customer Acquisition: Specific methods to convert prospects to customers
- Sales Plan: Process for closing sales and maintaining relationships

6. OPERATIONS PLAN
- Location: Details about business location and why it was chosen
- Facilities: Description of physical space requirements
- Equipment: Technology and other capital needs
- Day-to-day Operations: How the business will function

7. MANAGEMENT TEAM
- Organizational Structure: How the business will be organized
- Key Members: Description of essential roles and responsibilities
- External Resources: Advisors, consultants, and service providers

8. FINANCIAL PLAN
- Startup Costs: Detailed breakdown of initial expenses
- Revenue Projections: Forecasted earnings over 3 years
- Operating Costs: Monthly/annual expenses 
- Break-Even Analysis: When the business becomes profitable

9. RISK ANALYSIS
- Potential Risks: Internal and external threats
- Mitigation Strategies: Plans to address each risk

10. IMPLEMENTATION TIMELINE
- Key Milestones: Important dates and goals
- Implementation Plan: Step-by-step action plan

IMPORTANT GUIDELINES:
- Be specific and detailed with practical information
- Provide realistic numbers and timeframes where appropriate
- Write in a professional business tone
- Focus on actionable content that would be valuable to potential investors`;

		try {
			// Call the Google Gemini API
			if (!model) {
				throw new Error("Google Gemini model not initialized - check API key configuration");
			}
			
			const result = await model.generateContent(prompt);
			const response = await result.response;
			const aiResponse = await response.text();
			
			console.log("Successfully generated AI content for business plan");
			
			// Return the raw AI response
			return NextResponse.json({
				businessName: formData.businessName,
				industry: formData.industry,
				businessType: formData.businessType,
				location: formData.location,
				rawResponse: aiResponse,
				message: "Generated with AI"
			});
		} catch (error) {
			console.error("Error calling Google Gemini API:", error);
			
			// Determine if it's an API key issue
			const errorMessage = error.message || "Unknown error";
			const isKeyError = errorMessage.includes("API key") || 
				errorMessage.includes("authentication") || 
				errorMessage.includes("auth") ||
				errorMessage.includes("credential");
				
			if (isKeyError) {
				console.error("Possible API key configuration issue:", GOOGLE_API_KEY ? "Key exists but may be invalid" : "Key is missing");
			}
			
			return NextResponse.json({
				error: "Failed to generate business plan with AI",
				message: errorMessage,
				possibleKeyIssue: isKeyError
			}, { status: 500 });
		}
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ 
			error: "Failed to process request" 
		}, { status: 500 });
	}
}

// Helper function to create the structured response
function createStructuredResponse(formData) {
	return {
		data: {
			executiveSummary: {
				missionStatement: "",
				visionStatement: "",
				businessOverview: ""
			},
			businessOverview: {
				description: formData.businessConcept || "",
				problemStatement: "",
				solution: "",
				targetMarket: formData.targetMarket || "",
				marketSize: ""
			},
			productsServices: {
				description: "",
				pricingStrategy: "",
				distributionChannels: ""
			},
			marketAnalysis: {
				marketTrends: "",
				customerSegments: "",
				competitiveLandscape: ""
			},
			marketingStrategy: {
				promotionStrategies: "",
				customerAcquisition: "",
				salesPlan: ""
			},
			operationsPlan: {
				location: formData.location || "",
				facilities: "",
				equipment: "",
				dailyOperations: ""
			},
			managementTeam: {
				organizationalStructure: "",
				keyMembers: "",
				externalResources: ""
			},
			financialPlan: {
				startupCosts: formData.startupCosts || "",
				revenueProjections: formData.expectedRevenue || "",
				operatingCosts: "",
				breakEvenAnalysis: ""
			},
			riskAnalysis: {
				potentialRisks: "",
				mitigationStrategies: ""
			},
			timeline: {
				milestones: formData.keyMilestones || "",
				implementationPlan: ""
			}
		},
		businessName: formData.businessName || "",
		industry: formData.industry || "",
		businessType: formData.businessType || "",
		location: formData.location || "",
		message: formData.useAI ? "Created AI-enhanced business plan" : "Created basic business plan"
	};
}

// Helper function to extract content for a specific topic
function extractContent(aiResponse, topic) {
	// Normalize the topic name
	const normalizedTopic = topic.toLowerCase().trim();

	// Try to find content based on headers or bold text
	const patterns = [
		// Match standard section headers (## Topic)
		new RegExp(`##\\s*${topic}[:\\s-]+(.*?)(?=\\n##|\\n\\s*\\d+\\.|$)`, 'is'),
		// Match bold text sections (**Topic**)
		new RegExp(`\\*\\*${topic}\\*\\*[:\\s-]+(.*?)(?=\\n\\*\\*|\\n\\s*\\d+\\.|$)`, 'is'),
		// Match numbered sections (1. Topic)
		new RegExp(`\\d+\\.\\s*${topic}[:\\s-]+(.*?)(?=\\n\\d+\\.|\\n##|$)`, 'is'),
		// Match labeled content (Topic: content)
		new RegExp(`${topic}[:\\s-]+(.*?)(?=\\n[A-Z][a-z]+[:\\s-]|\\n\\s*\\d+\\.|\\n##|\\n\\*\\*|$)`, 'is'),
		// Match any paragraph containing the topic
		new RegExp(`(?:[\\s\\n]|^)${normalizedTopic}[\\s\\n.:]+([^\\n]+)`, 'i')
	];

	for (const regex of patterns) {
		const match = aiResponse.match(regex);
		if (match && match[1]) {
			// Clean up markdown formatting
			let content = cleanupMarkdown(match[1].trim());

			// If the content includes the topic name again, it likely has mixed content
			if (content.toLowerCase().includes(normalizedTopic)) {
				// Try to extract only the relevant part
				const relevantMatch = content.match(new RegExp(`${normalizedTopic}[:\\s-]+([^.]+\\.)`, 'i'));
				if (relevantMatch && relevantMatch[1]) {
					content = relevantMatch[1].trim();
				}
			}

			// Remove content that looks like a prompt repetition
			content = content
				.replace(/Please provide a detailed business plan/i, '')
				.replace(/I'll create a detailed business plan/i, '')
				.replace(/Here is a detailed business plan/i, '')
				.replace(/based on the information provided/i, '')
				.replace(/for your consideration/i, '')
				.replace(/for the following business/i, '');

			return content;
		}
	}

	return "";
}

// Helper function to clean up markdown formatting
function cleanupMarkdown(text) {
	return text
		.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
		.replace(/\*(.*?)\*/g, '$1')     // Remove italic
		.replace(/```(.*?)```/gs, '$1')  // Remove code blocks
		.replace(/^-\s+/gm, '• ')        // Convert dashes to bullet points
		.replace(/\n+/g, ' ')            // Replace multiple newlines with space
		.replace(/\s\s+/g, ' ')          // Replace multiple spaces with single space
		.replace(/FORMAT INSTRUCTIONS:.*$/s, '') // Remove format instructions
		.replace(/IMPORTANT:.*$/s, '')   // Remove important notes
		.replace(/Use simple formatting.*$/s, '') // Remove formatting guidelines
		.replace(/When referring to.*$/s, '') // Remove component instructions
		.replace(/Provide practical.*$/s, '') // Remove practical advice meta-instructions
		.replace(/Be concise.*$/s, '')   // Remove conciseness meta-instructions
		.trim();
}

// Helper function to fill in empty fields with AI-generated content
function fillEmptyFields(structuredResponse, aiResponse) {
	// Check if we have AI response
	if (!aiResponse) return;

	// Define search terms for each field with multiple possible matches
	const searchTerms = {
		executiveSummary: {
			missionStatement: ['Mission Statement', 'Mission', 'Company Mission'],
			visionStatement: ['Vision Statement', 'Vision', 'Company Vision'],
			businessOverview: ['Business Overview', 'Company Overview', 'Overview']
		},
		businessOverview: {
			description: ['Business Description', 'Company Description', 'Overview'],
			problemStatement: ['Problem Statement', 'Problem', 'Market Problem'],
			solution: ['Solution', 'Our Solution', 'Value Solution'],
			targetMarket: ['Target Market', 'Target Audience', 'Customer Profile'],
			marketSize: ['Market Size', 'Total Addressable Market', 'TAM']
		},
		productsServices: {
			description: ['Products and Services', 'Products/Services', 'Offerings'],
			pricingStrategy: ['Pricing Strategy', 'Pricing', 'Price Points'],
			distributionChannels: ['Distribution Channels', 'Distribution', 'Sales Channels']
		},
		marketAnalysis: {
			marketTrends: ['Market Trends', 'Industry Trends', 'Trends'],
			customerSegments: ['Customer Segments', 'Target Customers', 'Demographics'],
			competitiveLandscape: ['Competitive Landscape', 'Competition', 'Competitors']
		},
		marketingStrategy: {
			promotionStrategies: ['Promotion Strategies', 'Marketing Plan', 'Advertising'],
			customerAcquisition: ['Customer Acquisition', 'Acquisition Strategy', 'User Acquisition'],
			salesPlan: ['Sales Plan', 'Sales Strategy', 'Revenue Strategy']
		},
		operationsPlan: {
			location: ['Business Location', 'Location Strategy', 'Facilities Location'],
			facilities: ['Facilities', 'Physical Space', 'Office Space'],
			equipment: ['Equipment', 'Technology', 'Hardware'],
			dailyOperations: ['Operations', 'Daily Operations', 'Business Operations']
		},
		managementTeam: {
			organizationalStructure: ['Organizational Structure', 'Team Structure', 'Management Structure'],
			keyMembers: ['Key Members', 'Key Personnel', 'Team Members'],
			externalResources: ['External Resources', 'Advisors', 'Consultants']
		},
		financialPlan: {
			startupCosts: ['Startup Costs', 'Initial Investment', 'Startup Capital'],
			revenueProjections: ['Revenue Projections', 'Expected Revenue', 'Projected Income'],
			operatingCosts: ['Operating Costs', 'Operating Expenses', 'Monthly Expenses'],
			breakEvenAnalysis: ['Break-Even Analysis', 'Break-Even Point', 'Profitability Point']
		},
		riskAnalysis: {
			potentialRisks: ['Potential Risks', 'Risk Factors', 'Business Risks'],
			mitigationStrategies: ['Mitigation Strategies', 'Risk Management', 'Contingency Plans']
		},
		timeline: {
			milestones: ['Key Milestones', 'Critical Milestones', 'Important Dates'],
			implementationPlan: ['Implementation Plan', 'Execution Plan', 'Action Steps']
		}
	};

	// Try to extract content for each field using multiple search terms
	for (const section in searchTerms) {
		for (const field in searchTerms[section]) {
			// Only fill if the field is empty
			if (!structuredResponse.data[section][field]) {
				for (const term of searchTerms[section][field]) {
					const content = extractContent(aiResponse, term);
					if (content) {
						structuredResponse.data[section][field] = content;
						break; // Stop once we find content
					}
				}
			}
		}
	}

	// Extract content from sections as fallback
	// If we still have empty fields, try extracting from entire sections
	const sections = {
		'Executive Summary': 'executiveSummary',
		'Business Overview': 'businessOverview',
		'Products and Services': 'productsServices',
		'Market Analysis': 'marketAnalysis',
		'Marketing Strategy': 'marketingStrategy',
		'Operations Plan': 'operationsPlan',
		'Management Team': 'managementTeam',
		'Financial Plan': 'financialPlan',
		'Risk Analysis': 'riskAnalysis',
		'Implementation Timeline': 'timeline'
	};

	// Extract entire sections as fallback
	for (const [sectionName, sectionKey] of Object.entries(sections)) {
		const sectionContent = extractContent(aiResponse, sectionName);

		// If we have empty fields in this section and found content, fill them
		for (const field in structuredResponse.data[sectionKey]) {
			if (!structuredResponse.data[sectionKey][field] && sectionContent) {
				// Create a simplified field name for searching
				const simplifiedField = field
					.replace(/([A-Z])/g, ' $1')
					.toLowerCase();

				// Look for content related to this field in the section
				const fieldPattern = new RegExp(`${simplifiedField}[:\\s-]+(.*?)(?=\\n|$)`, 'i');
				const match = sectionContent.match(fieldPattern);

				if (match && match[1]) {
					structuredResponse.data[sectionKey][field] = cleanupMarkdown(match[1].trim());
				} else {
					// Just use the entire section content as a fallback
					structuredResponse.data[sectionKey][field] = `From ${sectionName}: ${sectionContent.substring(0, 200).trim()}...`;
				}
			}
		}
	}
}

// Update the post-processing function to better handle Gemini output
function postProcessData(structuredResponse) {
	const data = structuredResponse.data;
	
	// For each section in the data object
	for (const sectionKey in data) {
		const section = data[sectionKey];
		
		// For each field in the current section
		for (const fieldKey in section) {
			let content = section[fieldKey];
			
			// Skip if empty or already processed
			if (!content || content === 'Not specified') continue;
			
			// Remove section numbers and headers
			content = content
				.replace(/^\d+\.\s*[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/i, '')  // Remove "1. Section Name:"
				.replace(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/i, '')          // Remove "Section Name:"
				.replace(/^See .*?:/i, '')                                      // Remove "See X:" references
				.replace(/^From .*?:/i, '')                                     // Remove "From X:" references
				.replace(/^\s*-\s+/g, '')                                       // Remove leading dashes
				.replace(/\d+\.\s*[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/gi, '')  // Remove any other "1. Section Name:"
				.replace(/[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/gi, '')          // Remove any other "Section Name:"
				.replace(/IMPORTANT GUIDELINES:.*$/s, '')                       // Remove guidelines section
				.replace(/FORMAT INSTRUCTIONS:.*$/s, '')                        // Remove format instructions
				.trim();
			
			// Preserve paragraph breaks for better formatting
			content = content
				.replace(/\n{3,}/g, '\n\n')                                       // Normalize multiple line breaks
				.replace(/([.!?])\s*\n/g, '$1\n\n')                               // Ensure sentence breaks have proper spacing
				.replace(/•/g, '- ')                                              // Standardize bullet points
				.replace(/^\s*[-*]\s*/gm, '- ');                                  // Standardize list markers
			
			// Format lists with proper line breaks
			if (content.includes('- ')) {
				const lines = content.split('\n');
				const formattedLines = [];
				
				for (let i = 0; i < lines.length; i++) {
					const line = lines[i].trim();
					if (line.startsWith('- ')) {
						// This is a list item, preserve it with spacing
						formattedLines.push(line);
						
						// If next line doesn't start with bullet but is part of this item, append it
						let nextIndex = i + 1;
						while (nextIndex < lines.length && 
							!lines[nextIndex].trim().startsWith('- ') && 
							lines[nextIndex].trim().length > 0) {
							formattedLines[formattedLines.length - 1] += ' ' + lines[nextIndex].trim();
							i = nextIndex;
							nextIndex++;
						}
					} else if (line.length > 0) {
						formattedLines.push(line);
					}
				}
				
				content = formattedLines.join('\n');
			}
			
			// Update the field with cleaned and formatted content
			section[fieldKey] = content.trim() || 'Not specified';
		}
	}
}
