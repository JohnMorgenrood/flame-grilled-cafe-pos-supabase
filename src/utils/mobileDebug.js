// Mobile debugging utilities
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const debugMobile = (message, data = {}) => {
  if (isMobile()) {
    console.log(`[MOBILE DEBUG] ${message}`, data);
    
    // Also try to display on screen for easier debugging
    const debugDiv = document.getElementById('mobile-debug') || createDebugDiv();
    const timestamp = new Date().toLocaleTimeString();
    debugDiv.innerHTML += `<div style="margin-bottom: 5px; font-size: 12px; color: #333;">[${timestamp}] ${message}</div>`;
    
    // Keep only last 10 messages
    const messages = debugDiv.children;
    if (messages.length > 10) {
      debugDiv.removeChild(messages[0]);
    }
  }
};

const createDebugDiv = () => {
  const debugDiv = document.createElement('div');
  debugDiv.id = 'mobile-debug';
  debugDiv.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
    font-family: monospace;
    font-size: 12px;
    max-width: 200px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 9999;
    display: ${window.location.search.includes('debug') ? 'block' : 'none'};
  `;
  document.body.appendChild(debugDiv);
  return debugDiv;
};

export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    isMobile: isMobile(),
    hasLocalStorage: typeof(Storage) !== "undefined",
    localStorageTest: testLocalStorage()
  };
};

const testLocalStorage = () => {
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    return true;
  } catch (e) {
    return false;
  }
};
