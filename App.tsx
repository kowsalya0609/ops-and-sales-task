
import React, { useState, useCallback } from 'react';
import { generateZip } from './services/documentService';
import { personalizeText } from './services/geminiService';
import { TaskSection } from './components/TaskSection';
import { CopyIcon, DownloadIcon, FileArchiveIcon, UserIcon, ZapIcon, Loader2 } from './components/Icons';

// Helper component for styled textareas with copy and AI buttons
interface EditableSectionProps {
  id: string;
  title: string;
  value: string;
  onChange: (id: string, value: string) => void;
  onPersonalize: (id: string, text: string) => Promise<void>;
  isPersonalizing: boolean;
  rows?: number;
}

const EditableSection: React.FC<EditableSectionProps> = ({ id, title, value, onChange, onPersonalize, isPersonalizing, rows = 10 }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPersonalize(id, value)}
            className="p-1.5 text-muted hover:text-primary transition-colors disabled:opacity-50"
            disabled={isPersonalizing}
            title="Personalize with AI"
          >
            {isPersonalizing ? <Loader2 className="w-5 h-5 animate-spin" /> : <ZapIcon className="w-5 h-5" />}
          </button>
          <button onClick={handleCopy} className="p-1.5 text-muted hover:text-primary transition-colors" title="Copy to clipboard">
            <CopyIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        rows={rows}
        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
      />
    </div>
  );
};


const App: React.FC = () => {
  const [userName, setUserName] = useState<string>('Your Name');
  const [isPersonalizing, setIsPersonalizing] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [sections, setSections] = useState({
    communication: `Subject: Get Ready to Boost Your Interview Confidence with InterviewBuddy

Hi Riya,

Thank you for reaching out to us! 😊

At InterviewBuddy, we help candidates like you prepare for real interviews through live one-on-one mock sessions with industry experts.
Each session includes:

A 30-minute live mock interview with an expert from your target field.
Instant feedback and improvement tips after the session.
A recording of your session to review your performance.
To book a session, just visit www.interviewbuddy.net, choose your preferred package and expert, and pick a convenient time slot.

If you book your first session this week, we’re offering a 10% discount with the code FIRST10 — a small nudge to help you get started!

Looking forward to helping you ace your next interview.

Best regards,
[Your Name]
Operations & Sales Team
InterviewBuddy
support@interviewbuddy.net`,
    followUp: `Hi Riya! 👋 This is [Your Name] from InterviewBuddy. Just checking in to see if you got my email about our mock interview packages. Slots are filling fast this week — would you like me to help you book your session?`,
    conflictHandling: `Riya’s preferred time (5 PM) conflicts with Expert A’s availability, so I scheduled her at 6 PM — the closest available slot. I would inform Riya about the small adjustment and confirm her availability.`,
    reporting: `This week, I contacted 40 leads and successfully converted 8 of them, with 3 new clients onboarded. Follow-up engagement improved response rates. Next week, I’ll focus on converting the 12 pending leads by improving my follow-up timing and personalizing my approach.`,
    customerHandling: `Hi [Customer Name],
I sincerely apologize for the delay you experienced during your session. Our expert had an unexpected technical issue and joined as soon as possible.
We truly appreciate your patience and understanding. To make up for the inconvenience, we’ll ensure priority scheduling for your next session.
Thank you for choosing InterviewBuddy!

Best regards,
[Your Name]
Customer Success Team`,
  });

  const handleTextChange = (id: string, value: string) => {
    setSections(prev => ({ ...prev, [id]: value }));
  };

  const handlePersonalize = useCallback(async (id: string, text: string) => {
    if (!userName.trim() || userName === "Your Name") {
      alert("Please enter your name first to personalize the text.");
      return;
    }
    setIsPersonalizing(id);
    try {
      const personalizedText = await personalizeText(text, userName);
      handleTextChange(id, personalizedText);
    } catch (error) {
      console.error("Failed to personalize text:", error);
      alert("An error occurred while personalizing the text. Please try again.");
    } finally {
      setIsPersonalizing(null);
    }
  }, [userName]);


  const handleGenerateFiles = async () => {
    if (userName === "Your Name" || !userName.trim()){
      alert("Please enter your name before generating the files.");
      return;
    }
    setIsGenerating(true);
    try {
      await generateZip(userName, sections);
    } catch (error) {
      console.error("Failed to generate ZIP file:", error);
      alert("An error occurred while generating the files. Please check the console for details.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const scheduleData = [
      { name: 'Riya Sharma', day: 'Tuesday', time: '5 PM', expert: 'Expert A', scheduled: '6 PM' },
      { name: 'Aman Gupta', day: 'Wednesday', time: '11 AM', expert: 'Expert B', scheduled: '11:30 AM' },
      { name: 'Sneha Iyer', day: 'Thursday', time: '3 PM', expert: 'Expert A', scheduled: '3 PM' },
  ];

  const metricsData = [
      { label: 'Leads Contacted', value: 40 },
      { label: 'Conversions', value: 8 },
      { label: 'Pending Follow-ups', value: 12 },
      { label: 'New Clients Onboarded', value: 3 },
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <header className="bg-card border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-primary">Ops & Sales Task Assistant</h1>
            <p className="text-muted">Complete your task efficiently with AI-powered assistance.</p>
          </div>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Your Name"
              className="pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent transition w-48"
            />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        <TaskSection title="Section 1: Communication Scenario" description="Draft a professional and friendly email reply to Riya Sharma.">
          <EditableSection id="communication" title="Email Reply" value={sections.communication} onChange={handleTextChange} onPersonalize={handlePersonalize} isPersonalizing={isPersonalizing === 'communication'} rows={15} />
        </TaskSection>

        <TaskSection title="Section 2: Sales Follow-up" description="Send a short, polite WhatsApp or SMS follow-up to Riya.">
          <EditableSection id="followUp" title="Follow-up Message" value={sections.followUp} onChange={handleTextChange} onPersonalize={handlePersonalize} isPersonalizing={isPersonalizing === 'followUp'} rows={4} />
        </TaskSection>

        <TaskSection title="Section 3: Scheduling & Ops Coordination" description="Handle scheduling conflicts and explain your reasoning.">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="border-b-2 border-gray-200">
                        <tr>
                            <th className="p-2">Customer Name</th>
                            <th className="p-2">Preferred Day</th>
                            <th className="p-2">Preferred Time</th>
                            <th className="p-2">Expert</th>
                            <th className="p-2 text-primary">Scheduled Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scheduleData.map((row, index) => (
                            <tr key={index} className="border-b border-gray-100">
                                <td className="p-2 font-medium">{row.name}</td>
                                <td className="p-2 text-muted">{row.day}</td>
                                <td className="p-2 text-muted">{row.time}</td>
                                <td className="p-2 text-muted">{row.expert}</td>
                                <td className="p-2 font-semibold text-primary-dark">{row.scheduled}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-text mb-2">Conflict Handling Explanation</h3>
              <textarea
                value={sections.conflictHandling}
                onChange={(e) => handleTextChange('conflictHandling', e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
            </div>
        </TaskSection>

        <TaskSection title="Section 4: Reporting & Metrics" description="Summarize the weekly performance based on the provided data.">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {metricsData.map((metric, index) => (
                    <div key={index} className="bg-primary-light p-4 rounded-lg text-center">
                        <p className="text-3xl font-bold text-primary">{metric.value}</p>
                        <p className="text-sm text-muted">{metric.label}</p>
                    </div>
                ))}
            </div>
             <h3 className="text-lg font-semibold text-text mb-2">Weekly Summary</h3>
             <textarea
                value={sections.reporting}
                onChange={(e) => handleTextChange('reporting', e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
              />
        </TaskSection>

        <TaskSection title="Section 5: Customer Handling Scenario" description="Draft a response to a customer whose session was delayed.">
          <EditableSection id="customerHandling" title="Customer Apology" value={sections.customerHandling} onChange={handleTextChange} onPersonalize={handlePersonalize} isPersonalizing={isPersonalizing === 'customerHandling'} rows={8} />
        </TaskSection>
        
        <div className="bg-card p-6 rounded-lg shadow-md sticky bottom-4 border border-gray-200">
            <h2 className="text-xl font-bold text-primary">Final Step: Generate & Submit</h2>
            <p className="text-muted mt-1 mb-4">Click the button below to generate DOCX and PDF files, which will be downloaded as a single ZIP archive. Then, upload this ZIP file to your submission form.</p>
            <button
                onClick={handleGenerateFiles}
                disabled={isGenerating}
                className="w-full md:w-auto flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
                {isGenerating ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <FileArchiveIcon className="w-6 h-6 mr-3" />}
                {isGenerating ? 'Generating Files...' : `Generate Ops_Sales_Task_${userName.replace(/\s+/g, '_') || 'YourName'}.zip`}
            </button>
        </div>
      </main>
    </div>
  );
};

export default App;
