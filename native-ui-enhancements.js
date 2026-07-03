/**
 * Ajustes de Interface Nativa para PWA RANUTRE
 * - Suporte a notch (franja) em dispositivos iOS
 * - Desabilitar pull-to-refresh acidental
 * - Melhorias de fluidez e responsividade
 * - Detecção de dispositivo e otimizações específicas
 */

// ============================================
// 1. DETECTAR E ADAPTAR PARA NOTCH
// ============================================
function initNotchSupport() {
  const html = document.documentElement;
  
  // Detectar se o dispositivo tem notch
  const hasNotch = () => {
    return CSS.supports('padding-top', 'env(safe-area-inset-top)');
  };
  
  if (hasNotch()) {
    console.log('Dispositivo com notch detectado');
    html.style.setProperty('--safe-top', 'env(safe-area-inset-top)');
    html.style.setProperty('--safe-bottom', 'env(safe-area-inset-bottom)');
    html.style.setProperty('--safe-left', 'env(safe-area-inset-left)');
    html.style.setProperty('--safe-right', 'env(safe-area-inset-right)');
  } else {
    html.style.setProperty('--safe-top', '0px');
    html.style.setProperty('--safe-bottom', '0px');
    html.style.setProperty('--safe-left', '0px');
    html.style.setProperty('--safe-right', '0px');
  }
}

// ============================================
// 2. DESABILITAR PULL-TO-REFRESH
// ============================================
function disablePullToRefresh() {
  let lastY = 0;
  
  document.addEventListener('touchstart', (e) => {
    lastY = e.touches[0].clientY;
  }, { passive: true });
  
  document.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - lastY;
    
    // Se está no topo e tentando puxar para baixo, prevenir
    if (window.scrollY === 0 && diff > 0) {
      // Permitir scroll normal, mas evitar o comportamento de refresh
      if (diff > 50) {
        e.preventDefault();
      }
    }
  }, { passive: false });
}

// ============================================
// 3. OTIMIZAR VIEWPORT PARA MOBILE
// ============================================
function optimizeViewport() {
  const viewport = document.querySelector('meta[name="viewport"]');
  
  if (viewport) {
    // Adicionar viewport-fit=cover para suportar notch
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no, maximum-scale=1.0'
    );
  }
}

// ============================================
// 4. MELHORAR FLUIDEZ COM PASSIVE LISTENERS
// ============================================
function optimizeEventListeners() {
  // Listeners de scroll e touch devem ser passive para melhor performance
  const passiveEvents = ['scroll', 'touchmove', 'touchstart', 'wheel'];
  
  passiveEvents.forEach((eventName) => {
    document.addEventListener(eventName, () => {}, { passive: true });
  });
}

// ============================================
// 5. AJUSTAR ALTURA DO VIEWPORT DINAMICAMENTE
// ============================================
function handleViewportHeightChange() {
  const updateHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  // Atualizar na primeira carga
  updateHeight();
  
  // Atualizar quando o viewport mudar (ex: teclado virtual aparecendo)
  window.addEventListener('resize', updateHeight, { passive: true });
  window.addEventListener('orientationchange', updateHeight, { passive: true });
}

// ============================================
// 6. SUPORTE A DARK MODE E LIGHT MODE
// ============================================
function initThemeSupport() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  
  const setTheme = (isDark) => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  };
  
  // Definir tema inicial
  setTheme(prefersDark.matches);
  
  // Escutar mudanças de preferência
  prefersDark.addEventListener('change', (e) => {
    setTheme(e.matches);
  });
}

// ============================================
// 7. OTIMIZAR TOUCH INTERACTIONS
// ============================================
function optimizeTouchInteractions() {
  // Adicionar feedback visual ao tocar em elementos interativos
  document.addEventListener('touchstart', (e) => {
    const target = e.target.closest('button, a, [role="button"]');
    if (target) {
      target.style.opacity = '0.7';
    }
  }, { passive: true });
  
  document.addEventListener('touchend', (e) => {
    const target = e.target.closest('button, a, [role="button"]');
    if (target) {
      target.style.opacity = '1';
    }
  }, { passive: true });
}

// ============================================
// 8. DETECTAR TIPO DE DISPOSITIVO
// ============================================
function detectDeviceType() {
  const ua = navigator.userAgent;
  let deviceType = 'unknown';
  
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua.toLowerCase())) {
    deviceType = 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(ua.toLowerCase())) {
    deviceType = 'tablet';
  } else {
    deviceType = 'desktop';
  }
  
  document.documentElement.setAttribute('data-device', deviceType);
  console.log(`Dispositivo detectado: ${deviceType}`);
  
  return deviceType;
}

// ============================================
// 9. OTIMIZAR ANIMAÇÕES PARA DISPOSITIVOS COM BATERIA BAIXA
// ============================================
function optimizeForBattery() {
  if ('getBattery' in navigator) {
    navigator.getBattery().then((battery) => {
      const updateBatteryStatus = () => {
        if (battery.level < 0.2 && !battery.charging) {
          // Reduzir animações se bateria estiver baixa
          document.documentElement.style.setProperty('--animation-duration', '0.1s');
          console.log('Modo economia de bateria ativado');
        } else {
          document.documentElement.style.setProperty('--animation-duration', '0.3s');
        }
      };
      
      updateBatteryStatus();
      battery.addEventListener('levelchange', updateBatteryStatus);
      battery.addEventListener('chargingchange', updateBatteryStatus);
    });
  } else if ('getBattery' in navigator.getBattery) {
    // Fallback para API mais recente
    navigator.getBattery().then((battery) => {
      console.log('Battery API disponível');
    });
  }
}

// ============================================
// 10. SUPORTE A SAFE AREA INSETS
// ============================================
function applySafeAreaInsets() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --safe-top: env(safe-area-inset-top, 0px);
      --safe-bottom: env(safe-area-inset-bottom, 0px);
      --safe-left: env(safe-area-inset-left, 0px);
      --safe-right: env(safe-area-inset-right, 0px);
      --vh: 1vh;
    }
    
    body {
      padding-top: var(--safe-top);
      padding-bottom: var(--safe-bottom);
      padding-left: var(--safe-left);
      padding-right: var(--safe-right);
    }
    
    .header {
      padding-top: var(--safe-top);
    }
    
    .main {
      min-height: calc(100vh - var(--safe-top) - var(--safe-bottom));
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// 11. DETECTAR CONEXÃO E AJUSTAR QUALIDADE
// ============================================
function optimizeForConnection() {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    
    const updateConnectionStatus = () => {
      const effectiveType = connection.effectiveType;
      document.documentElement.setAttribute('data-connection', effectiveType);
      
      if (effectiveType === '4g') {
        console.log('Conexao 4G - Carregando recursos em alta qualidade');
      } else if (effectiveType === '3g') {
        console.log('Conexao 3G - Reduzindo qualidade de recursos');
      } else {
        console.log('Conexao lenta - Modo economia ativado');
      }
    };
    
    updateConnectionStatus();
    connection.addEventListener('change', updateConnectionStatus);
  }
}

// ============================================
// 12. INICIALIZAÇÃO
// ============================================
function initNativeUIEnhancements() {
  console.log('Inicializando ajustes de interface nativa...');
  
  initNotchSupport();
  disablePullToRefresh();
  optimizeViewport();
  optimizeEventListeners();
  handleViewportHeightChange();
  initThemeSupport();
  optimizeTouchInteractions();
  detectDeviceType();
  optimizeForBattery();
  applySafeAreaInsets();
  optimizeForConnection();
  
  console.log('Ajustes de interface nativa inicializados com sucesso');
}

// Executar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNativeUIEnhancements);
} else {
  initNativeUIEnhancements();
}

// Exportar para uso global
window.NativeUIEnhancements = {
  initNotchSupport,
  disablePullToRefresh,
  optimizeViewport,
  detectDeviceType,
  optimizeForConnection
};
