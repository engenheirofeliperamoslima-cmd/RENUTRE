/**
 * Otimizações de Desempenho e Fluidez para PWA RANUTRE
 * - Lazy loading de imagens
 * - Preload de recursos críticos
 * - Debouncing de eventos
 * - Otimização de animações
 */

// ============================================
// 1. PRELOAD DE RECURSOS CRÍTICOS
// ============================================
function preloadCriticalResources() {
  // Preload de fontes (reduz CLS - Cumulative Layout Shift)
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.href = 'https://fonts.gstatic.com/s/fraunces/v31/6NUu876S_S7PzNRE97L_Z3X696K1_p7b_2uM.woff2';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);

  // Preload do Leaflet (mapa)
  const leafletLink = document.createElement('link');
  leafletLink.rel = 'preload';
  leafletLink.as = 'script';
  leafletLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
  document.head.appendChild(leafletLink);
}

// ============================================
// 2. LAZY LOADING DE IMAGENS
// ============================================
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ============================================
// 3. DEBOUNCING PARA EVENTOS DE SCROLL/RESIZE
// ============================================
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Exemplo de uso para scroll
const onScroll = debounce(() => {
  // Lógica de scroll otimizada
}, 100);

window.addEventListener('scroll', onScroll, { passive: true });

// ============================================
// 4. OTIMIZAÇÃO DE ANIMAÇÕES COM requestAnimationFrame
// ============================================
function optimizeAnimations() {
  // Usar requestAnimationFrame para animações suaves
  let animationFrameId;
  
  function animateElement(element, property, startValue, endValue, duration) {
    const startTime = performance.now();
    
    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      
      const value = startValue + (endValue - startValue) * easeProgress;
      element.style[property] = value;
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    }
    
    animationFrameId = requestAnimationFrame(animate);
  }
  
  return animateElement;
}

// ============================================
// 5. COMPRESSÃO E MINIFICAÇÃO DE DADOS
// ============================================
function compressData(data) {
  // Converter objeto para JSON comprimido
  return JSON.stringify(data);
}

function decompressData(compressedData) {
  // Descomprimir JSON
  return JSON.parse(compressedData);
}

// ============================================
// 6. CACHE DE COMPUTAÇÕES CUSTOSAS
// ============================================
const computationCache = new Map();

function memoize(func, key) {
  if (computationCache.has(key)) {
    return computationCache.get(key);
  }
  
  const result = func();
  computationCache.set(key, result);
  return result;
}

// ============================================
// 7. MONITORAMENTO DE PERFORMANCE
// ============================================
function monitorPerformance() {
  if ('PerformanceObserver' in window) {
    try {
      // Observar Long Tasks (tarefas que demoram mais de 50ms)
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn('Long Task detectada:', entry.duration, 'ms');
        }
      });
      
      observer.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      console.log('PerformanceObserver não suportado para longtask');
    }
  }

  // Medir Core Web Vitals
  if ('web-vital' in window) {
    window.addEventListener('load', () => {
      const paintEntries = performance.getEntriesByType('paint');
      console.log('Paint Entries:', paintEntries);
    });
  }
}

// ============================================
// 8. REDUZIR REFLOW/REPAINT
// ============================================
function batchDOMUpdates(updates) {
  // Usar DocumentFragment para evitar múltiplos reflows
  const fragment = document.createDocumentFragment();
  
  updates.forEach((update) => {
    const element = document.createElement(update.tag);
    element.className = update.className;
    element.textContent = update.text;
    fragment.appendChild(element);
  });
  
  return fragment;
}

// ============================================
// 9. USAR WILL-CHANGE COM MODERAÇÃO
// ============================================
function enableHardwareAcceleration(element) {
  // Ativar aceleração de hardware para elementos que serão animados
  element.style.willChange = 'transform, opacity';
  
  // Desativar após a animação
  element.addEventListener('animationend', () => {
    element.style.willChange = 'auto';
  }, { once: true });
}

// ============================================
// 10. INICIALIZAÇÃO
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  preloadCriticalResources();
  initLazyLoading();
  monitorPerformance();
});

// Exportar funções para uso global
window.PerformanceOptimizations = {
  debounce,
  optimizeAnimations: optimizeAnimations(),
  compressData,
  decompressData,
  memoize,
  batchDOMUpdates,
  enableHardwareAcceleration
};
