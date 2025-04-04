import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const GOOGLE_API_KEY = "AIzaSyDzTDgDu81wfiEoAq6ybh2VNvVs7-Gmexw";

let genAI;
let model;

try {
	genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
	model = genAI.getGenerativeModel({ 
		model: "gemini-1.5-flash",
		systemInstruction: "Create concise, practical business plans with essential information only.",
		generationConfig: {
			maxOutputTokens: 2048,
			temperature: 0.7,
			topP: 0.8,
			topK: 40
		}
	});
} catch (error) {
	console.error("Error initializing Google Generative AI:", error);
}

export async function POST(request) {
	try {
		const formData = await request.json();
		
		if (!formData.useAI) {
			const basicResponse = createStructuredResponse(formData);
			return NextResponse.json(basicResponse);
		}
		
		const prompt = `Create a brief business plan for:
		
Business Name: ${formData.businessName || "Not specified"}
Industry: ${formData.industry || "Not specified"}
Business Type: ${formData.businessType || "Not specified"}
Location: ${formData.location || "Not specified"}
Business Concept: ${formData.businessConcept || "Not specified"}
Target Market: ${formData.targetMarket || "Not specified"}
Unique Value: ${formData.uniqueValue || "Not specified"}
Startup Costs: ${formData.startupCosts || "Not specified"}
Expected Revenue: ${formData.expectedRevenue || "Not specified"}
Key Milestones: ${formData.keyMilestones || "Not specified"}

Include these sections with very brief content:
1. Executive Summary (mission, vision, overview)
2. Business Overview (description, problem, solution, target market, market size)
3. Products/Services (description, pricing, distribution)
4. Marketing (trends, segments, competition, promotion, acquisition)
5. Operations (location, facilities, equipment, operations)
6. Management (structure, key members, resources)
7. Financial (costs, projections, operating costs, break-even)
8. Risks (potential risks, mitigation)
9. Timeline (milestones, implementation)

Be practical, concise, and business-focused.`;

		try {
			if (!model) {
				throw new Error("Google Gemini model not initialized - check API key configuration");
			}
			
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 8000);
			
			try {
				const result = await model.generateContent(prompt);
				clearTimeout(timeoutId);
				
				const response = await result.response;
				const aiResponse = await response.text();
				
				console.log("Successfully generated AI content for business plan");
				
				return NextResponse.json({
					businessName: formData.businessName,
					industry: formData.industry,
					businessType: formData.businessType,
					location: formData.location,
					rawResponse: aiResponse,
					message: "Generated with AI"
				});
			} catch (abortError) {
				clearTimeout(timeoutId);
				throw abortError;
			}
		} catch (error) {
			console.error("Error calling Google Gemini API:", error);
			
			const errorMessage = error.message || "Unknown error";
			const isKeyError = errorMessage.includes("API key") || 
				errorMessage.includes("authentication") || 
				errorMessage.includes("auth") ||
				errorMessage.includes("credential");
				
			if (isKeyError) {
				console.error("Possible API key configuration issue:", GOOGLE_API_KEY ? "Key exists but may be invalid" : "Key is missing");
			}
			
			const basicResponse = createStructuredResponse(formData);
			basicResponse.error = errorMessage;
			basicResponse.message = "Failed to generate with AI - using basic template";
			
			return NextResponse.json(basicResponse, { status: 200 });
		}
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ 
			error: "Failed to process request" 
		}, { status: 500 });
	}
}

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

function extractContent(aiResponse, topic) {
	const normalizedTopic = topic.toLowerCase().trim();

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
			let content = cleanupMarkdown(match[1].trim());
			if (content.toLowerCase().includes(normalizedTopic)) {
				const relevantMatch = content.match(new RegExp(`${normalizedTopic}[:\\s-]+([^.]+\\.)`, 'i'));
				if (relevantMatch && relevantMatch[1]) {
					content = relevantMatch[1].trim();
				}
			}

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

function cleanupMarkdown(text) {
	return text
		.replace(/\*\*(.*?)\*\*/g, '$1')
		.replace(/\*(.*?)\*/g, '$1')     
		.replace(/```(.*?)```/gs, '$1')  
		.replace(/^-\s+/gm, '• ')       
		.replace(/\n+/g, ' ')            
		.replace(/\s\s+/g, ' ')          
		.replace(/FORMAT INSTRUCTIONS:.*$/s, '') 
		.replace(/IMPORTANT:.*$/s, '')  
		.replace(/Use simple formatting.*$/s, '')
		.replace(/When referring to.*$/s, '')
		.replace(/Provide practical.*$/s, '') 
		.replace(/Be concise.*$/s, '')
		.trim();
}

function fillEmptyFields(structuredResponse, aiResponse) {
	if (!aiResponse) return;

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

	for (const section in searchTerms) {
		for (const field in searchTerms[section]) {
			if (!structuredResponse.data[section][field]) {
				for (const term of searchTerms[section][field]) {
					const content = extractContent(aiResponse, term);
					if (content) {
						structuredResponse.data[section][field] = content;
						break;
					}
				}
			}
		}
	}

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

	for (const [sectionName, sectionKey] of Object.entries(sections)) {
		const sectionContent = extractContent(aiResponse, sectionName);

		for (const field in structuredResponse.data[sectionKey]) {
			if (!structuredResponse.data[sectionKey][field] && sectionContent) {
				const simplifiedField = field
					.replace(/([A-Z])/g, ' $1')
					.toLowerCase();

				const fieldPattern = new RegExp(`${simplifiedField}[:\\s-]+(.*?)(?=\\n|$)`, 'i');
				const match = sectionContent.match(fieldPattern);

				if (match && match[1]) {
					structuredResponse.data[sectionKey][field] = cleanupMarkdown(match[1].trim());
				} else {
					structuredResponse.data[sectionKey][field] = `From ${sectionName}: ${sectionContent.substring(0, 200).trim()}...`;
				}
			}
		}
	}
}

function postProcessData(structuredResponse) {
	const data = structuredResponse.data;
	
	for (const sectionKey in data) {
		const section = data[sectionKey];
		
		for (const fieldKey in section) {
			let content = section[fieldKey];
			
			if (!content || content === 'Not specified') continue;
			
			content = content
				.replace(/^\d+\.\s*[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/i, '')  
				.replace(/^[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/i, '')          
				.replace(/^See .*?:/i, '')                                     
				.replace(/^From .*?:/i, '')                                    
				.replace(/^\s*-\s+/g, '')                                       
				.replace(/\d+\.\s*[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/gi, '')  
				.replace(/[A-Z][a-z]+(\s+[A-Z][a-z]+)*\s*[-:]/gi, '')          
				.replace(/IMPORTANT GUIDELINES:.*$/s, '')                       
				.replace(/FORMAT INSTRUCTIONS:.*$/s, '')                        
				.trim();
			
			content = content
				.replace(/\n{3,}/g, '\n\n')                                       
				.replace(/([.!?])\s*\n/g, '$1\n\n')                               
				.replace(/•/g, '- ')                                              
				.replace(/^\s*[-*]\s*/gm, '- ');

			if (content.includes('- ')) {
				const lines = content.split('\n');
				const formattedLines = [];
				
				for (let i = 0; i < lines.length; i++) {
					const line = lines[i].trim();
					if (line.startsWith('- ')) {
						formattedLines.push(line);
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
			
			section[fieldKey] = content.trim() || 'Not specified';
		}
	}
}
