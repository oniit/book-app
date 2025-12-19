const APP_NAME = "E-Jadwal | Rektorat UINSSC";

(function() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

async function loadPartial(containerId, partialPath, fallbackHtml = null) {
    try {
        const response = await fetch(partialPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${partialPath}: ${response.status} ${response.statusText}`);
        }
        
        const html = await response.text();
        
        const container = document.getElementById(containerId);
        if (!container) {
            if (fallbackHtml) {
                const fallbackContainer = document.querySelector(`#${containerId}`);
                if (fallbackContainer) {
                    fallbackContainer.innerHTML = fallbackHtml;
                    return true;
                }
            }
            return false;
        }
        
        if (html.includes('<!DOCTYPE html>') && !html.includes('Header & Logo')) {
            if (fallbackHtml) {
                container.innerHTML = fallbackHtml;
                return true;
            }
            throw new Error(`Received full HTML page instead of partial`);
        }
        
        container.innerHTML = html;
        return true;
    } catch (error) {
        if (fallbackHtml) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = fallbackHtml;
                return true;
            }
        }
        return false;
    }
}

async function init() {
    document.title = APP_NAME; 
    
    if (window.location.pathname.includes('admin')) {
        document.title = `Admin ${APP_NAME}`;
    }
    
    try {
        const results = await Promise.all([
            loadPartial('header-container', '/partials/header.html'),
            loadPartial('jadwal-container', '/partials/jadwal.html')
        ]);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const script = document.createElement('script');
        script.src = '/script.js';
        script.onload = () => {
            setTimeout(() => {
                window.dispatchEvent(new Event('partialsLoaded'));
            }, 50);
        };
        script.onerror = (error) => {
            console.error('[init] Failed to load script.js:', error);
        };
        document.body.appendChild(script);
    } catch (error) {
        console.error('[init] Error loading partials:', error);
    }
}