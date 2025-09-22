import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Select from 'react-select';
import { BsStars } from 'react-icons/bs';
import { HiOutlineCode } from 'react-icons/hi';
import Editor from '@monaco-editor/react';
import { IoCloseSharp, IoCopy } from 'react-icons/io5';
import { PiExportBold } from 'react-icons/pi';
import { ImNewTab } from 'react-icons/im';
import { FiRefreshCcw } from 'react-icons/fi';
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {

  // ✅ Fixed typos in options
  const options = [
    { value: 'html-css', label: 'HTML + CSS' },
    { value: 'html-tailwind', label: 'HTML + Tailwind CSS' },
    { value: 'html-bootstrap', label: 'HTML + Bootstrap' },
    { value: 'html-css-js', label: 'HTML + CSS + JS' },
    { value: 'html-tailwind-bootstrap', label: 'HTML + Tailwind + Bootstrap' },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [frameWork, setFrameWork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTabOpen, setIsNewTabOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Extract code safely
  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // ⚠️ API Key (you said you want it inside the file)
  const apiKey = import.meta.env.VITE_GOOGLE_GENAI_API_KEY;
  
  if (!apiKey) {
    console.warn("VITE_GOOGLE_GENAI_API_KEY is missing. Add it to .env and restart the dev server.");
  }

  // use it (note: frontend keys are public — see security section)
  const ai = new GoogleGenAI({
    apiKey: apiKey
  });

  // ✅ Generate code
  async function getResponse() {
    if (!prompt.trim()) return toast.error("Please describe your component first");

    try {
      setLoading(true);
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `
     You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${frameWork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.
      `,
      });

      setCode(extractCode(response.text));
      setOutputScreen(true);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while generating code");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Copy Code
  const copyCode = async () => {
    if (!code.trim()) return toast.error("No code to copy");
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clipboard");
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast.error("Failed to copy");
    }
  };

  // ✅ Download Code
  const downnloadFile = () => {
    if (!code.trim()) return toast.error("No code to download");

    const fileName = "GenUI-Code.html"
    const blob = new Blob([code], { type: 'text/plain' });
    let url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  return (
    <>
      <Navbar />
      
      {/* Background gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-pink-900/20 pointer-events-none"></div>

      {/* ✅ Enhanced responsive layout with better spacing */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-16">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
          
          {/* Left Section - Enhanced */}
          <div className="w-full py-8 lg:py-10 rounded-2xl bg-gradient-to-br from-[#1a1825] to-[#141319] border border-gray-800/50 shadow-2xl backdrop-blur-sm mt-6">
            <div className="px-6 lg:px-8">
              {/* Header with gradient text */}
              <div className="mb-8">
                <h3 className='text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-3'>
                  AI Component Generator
                </h3>
                <p className='text-gray-400 text-base lg:text-lg leading-relaxed'>
                  Describe your component and let AI code it for you with modern design patterns.
                </p>
              </div>

              {/* Framework Section */}
              <div className="mb-6">
                <label className='block text-sm font-semibold text-gray-200 mb-3'>
                  Choose Framework
                </label>
                <Select
                  options={options}
                  value={frameWork}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#0a0a0f",
                      borderColor: state.isFocused ? "#8b5cf6" : "#374151",
                      borderWidth: "2px",
                      borderRadius: "12px",
                      color: "#fff",
                      boxShadow: state.isFocused ? "0 0 0 3px rgba(139, 92, 246, 0.1)" : "none",
                      padding: "4px",
                      transition: "all 0.2s",
                      "&:hover": { borderColor: "#6b7280" }
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#0a0a0f",
                      border: "2px solid #374151",
                      borderRadius: "12px",
                      color: "#fff",
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#8b5cf6"
                        : state.isFocused
                          ? "#374151"
                          : "transparent",
                      color: "#fff",
                      padding: "12px 16px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      "&:active": { backgroundColor: "#6366f1" }
                    }),
                    singleValue: (base) => ({ ...base, color: "#fff" }),
                    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
                    input: (base) => ({ ...base, color: "#fff" })
                  }}
                  onChange={(selected) => setFrameWork(selected)}
                />
              </div>

              {/* Prompt Section */}
              <div className="mb-8">
                <label className='block text-sm font-semibold text-gray-200 mb-3'>
                  Describe Your Component
                </label>
                <div className="relative">
                  <textarea
                    onChange={(e) => setPrompt(e.target.value)}
                    value={prompt}
                    className='w-full min-h-[180px] lg:min-h-[220px] rounded-xl bg-[#0a0a0f] border-2 border-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 p-4 text-white placeholder-gray-400 outline-none resize-none transition-all duration-200 text-sm lg:text-base leading-relaxed'
                    placeholder="Describe your component in detail... 
For example: 'Create a modern pricing card with gradient background, hover animations, and three pricing tiers'"
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {prompt.length}/2000
                  </div>
                </div>
              </div>

              {/* Generate Button Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className='text-gray-400 text-sm lg:text-base'>
                  Click generate to create your component
                </p>
                <button
                  onClick={getResponse}
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white font-semibold text-sm lg:text-base shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <ClipLoader color='white' size={18} />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <BsStars className="text-lg" />
                      <span>Generate Component</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Enhanced */}
          <div className="relative mt-2 w-full h-[70vh] lg:h-[80vh] bg-gradient-to-br from-[#1a1825] to-[#141319] border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm">
            {
              !outputScreen ? (
                <div className="w-full h-full flex items-center flex-col justify-center p-8">
                  <div className="relative mb-6">
                    {/* Animated background rings */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 animate-pulse"></div>
                    <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30 animate-ping"></div>
                    <div className="relative p-6 w-20 h-20 lg:w-24 lg:h-24 flex items-center justify-center text-3xl lg:text-4xl rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 shadow-xl">
                      <HiOutlineCode className="text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl lg:text-2xl font-semibold text-gray-200 mb-2">Ready to Generate</h4>
                  <p className='text-sm lg:text-base text-gray-400 text-center max-w-xs'>
                    Your component preview and code will appear here after generation.
                  </p>
                </div>
              ) : (
                <>
                  {/* Enhanced Tabs */}
                  <div className="bg-gradient-to-r from-[#1f1f27] to-[#17171c] w-full h-14 flex items-center gap-2 px-4 border-b border-gray-800/50">
                    <button
                      onClick={() => setTab(1)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        tab === 1 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Code Editor
                      </span>
                    </button>
                    <button
                      onClick={() => setTab(2)}
                      className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        tab === 2 
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg" 
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        Live Preview
                      </span>
                    </button>
                  </div>

                  {/* Enhanced Toolbar */}
                  <div className="bg-gradient-to-r from-[#1f1f27] to-[#17171c] w-full h-12 flex items-center justify-between px-4 border-b border-gray-800/30">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className='ml-3 text-sm font-medium text-gray-300'>
                        {tab === 1 ? 'Code Editor' : 'Live Preview'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {tab === 1 ? (
                        <>
                          <button 
                            onClick={copyCode} 
                            className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 text-sm"
                            title="Copy Code"
                          >
                            <IoCopy />
                          </button>
                          <button 
                            onClick={downnloadFile} 
                            className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 text-sm"
                            title="Download File"
                          >
                            <PiExportBold />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => setIsNewTabOpen(true)} 
                            className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 text-sm"
                            title="Open in Fullscreen"
                          >
                            <ImNewTab />
                          </button>
                          <button 
                            onClick={() => setRefreshKey(prev => prev + 1)} 
                            className="w-8 h-8 rounded-lg border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 hover:border-gray-600 transition-all duration-200 text-sm"
                            title="Refresh Preview"
                          >
                            <FiRefreshCcw />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Editor / Preview */}
                  <div className="h-[calc(100%-6.5rem)]">
                    {tab === 1 ? (
                      <Editor 
                        value={code} 
                        height="100%" 
                        theme='vs-dark' 
                        language="html"
                        options={{
                          minimap: { enabled: false },
                          fontSize: 14,
                          lineHeight: 22,
                          padding: { top: 16, bottom: 16 },
                          scrollBeyondLastLine: false,
                          wordWrap: 'on',
                          automaticLayout: true
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-white relative">
                        <iframe 
                          key={refreshKey} 
                          srcDoc={code} 
                          className="w-full h-full border-0"
                          title="Component Preview"
                        />
                        {/* Loading overlay for iframe */}
                        <div className="absolute inset-0 bg-white flex items-center justify-center pointer-events-none opacity-0 transition-opacity">
                          <ClipLoader color='#8b5cf6' size={24} />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )
            }
          </div>
        </div>
      </div>

      {/* ✅ Enhanced Fullscreen Preview Overlay */}
      {isNewTabOpen && (
        <div className="fixed inset-0 bg-white w-screen h-screen overflow-auto z-50">
          <div className="text-black w-full h-16 flex items-center justify-between px-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className='ml-4 font-semibold text-gray-800'>Fullscreen Preview</span>
            </div>
            <button 
              onClick={() => setIsNewTabOpen(false)} 
              className="w-10 h-10 rounded-xl border-2 border-gray-300 flex items-center justify-center hover:bg-gray-200 hover:border-gray-400 transition-all duration-200 text-gray-600 hover:text-gray-800"
              title="Close Fullscreen"
            >
              <IoCloseSharp className="text-lg" />
            </button>
          </div>
          <iframe 
            srcDoc={code} 
            className="w-full h-[calc(100vh-4rem)] border-0"
            title="Fullscreen Component Preview"
          />
        </div>
      )}
    </>
  )
}

export default Home