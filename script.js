// script.js - Landing Page para Psicólogo (Formulário com WhatsApp obrigatório)
document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos principais
    const leadForm = document.getElementById('leadForm');
    const phoneInput = document.getElementById('phone');
    const submitBtn = document.getElementById('submitBtn');
    const menuToggle = document.getElementById('menuToggle');
    const navMobile = document.getElementById('navMobile');
    const successModal = document.getElementById('successModal');
    const closeModal = document.getElementById('closeModal');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    // Estado do formulário
    let formSubmitted = false;
    
    // Máscara para telefone (WhatsApp)
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Limita a 11 dígitos (DDD + 9 dígitos)
            if (value.length > 11) {
                value = value.substring(0, 11);
            }
            
            // Aplica a máscara: (XX) XXXXX-XXXX
            if (value.length === 11) {
                value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            } else if (value.length > 6) {
                value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            } else if (value.length > 2) {
                value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            } else if (value.length > 0) {
                value = value.replace(/^(\d*)/, '($1');
            }
            
            e.target.value = value;
        });
    }
    
    // Validação do formulário
    if (leadForm) {
        leadForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (formSubmitted) return;
            
            // Validação dos campos obrigatórios
            const name = document.getElementById('name').value.trim();
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const terms = document.getElementById('terms').checked;
            
            // Validação do nome (obrigatório)
            if (!name || name.length < 3) {
                showError('Por favor, insira seu nome completo (mínimo 3 caracteres)');
                return;
            }
            
            // Validação do WhatsApp (obrigatório e com 11 dígitos)
            const phoneDigits = phone.replace(/\D/g, '');
            if (!phone || phoneDigits.length !== 11) {
                showError('Por favor, insira um número de WhatsApp válido com DDD + 9 dígitos');
                return;
            }
            
            // Validação dos termos (obrigatório)
            if (!terms) {
                showError('Você precisa concordar em receber comunicações para baixar o ebook');
                return;
            }
            
            // Desabilita botão e mostra loading
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando seu download...';
            
            // Salva os dados localmente
            const leadData = {
                name: name,
                phone: phone,
                phoneDigits: phoneDigits,
                timestamp: new Date().toISOString(),
                pageUrl: window.location.href
            };
            
            localStorage.setItem('leadData', JSON.stringify(leadData));
            
            try {
                // Simula processamento de download
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Mostra modal de sucesso com mensagem personalizada
                showSuccessModal(name, phone);
                
                formSubmitted = true;
                
                // Simula o download do ebook após 1 segundo
                setTimeout(() => {
                    simulateEbookDownload();
                }, 1000);
                
            } catch (error) {
                console.error('Erro no processo:', error);
                showError('Ocorreu um erro ao processar seu download. Por favor, tente novamente.');
            } finally {
                // Restaura botão após 3 segundos
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnContent;
                }, 3000);
            }
        });
    }
    
    // Função para simular download do ebook
    function simulateEbookDownload() {
        // Cria um link de download simulado
        const downloadLink = document.createElement('a');
        downloadLink.href = 'data:application/pdf;base64,' + btoa('Ebook Mulheres Emocionalmente Fortes - PDF Simulado');
        downloadLink.download = 'Mulheres-Emocionalmente-Fortes.pdf';
        downloadLink.style.display = 'none';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    
    // Função para mostrar erro
    function showError(message) {
        // Remove erro anterior se existir
        const existingError = document.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        // Cria elemento de erro
        const errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        // Estilos do erro
        errorDiv.style.cssText = `
            background-color: rgba(239, 68, 68, 0.1);
            border: 1px solid var(--danger-color);
            padding: 12px 15px;
            margin: 15px 0;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--danger-color);
            font-weight: 500;
            animation: fadeIn 0.3s ease;
        `;
        
        // Insere antes do botão de submit
        if (submitBtn && submitBtn.parentNode) {
            submitBtn.parentNode.insertBefore(errorDiv, submitBtn);
        }
        
        // Remove após 5 segundos
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    // Modal de sucesso personalizado
    function showSuccessModal(name, phone) {
        // Formata o telefone para exibição
        const formattedPhone = phone.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        
        // Atualiza o conteúdo do modal
        const modalBody = document.querySelector('.modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <i class="fas fa-check-circle" style="font-size: 3rem; color: var(--success-color);"></i>
                </div>
                <p><strong>Parabéns, ${name}!</strong> Seu ebook está sendo baixado...</p>
                <p>Em instantes você receberá o arquivo "Mulheres Emocionalmente Fortes.pdf"</p>
                
                <div style="margin: 25px 0; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid var(--primary-color);">
                    <p style="font-size: 0.9rem; margin: 0 0 10px 0;"><i class="fas fa-mobile-alt"></i> <strong>WhatsApp registrado:</strong> ${formattedPhone}</p>
                    <p style="font-size: 0.85rem; margin: 0;"><i class="fas fa-info-circle"></i> Você também receberá conteúdos exclusivos por aqui</p>
                </div>
                
                <div style="margin-top: 20px; padding: 15px; background: var(--gradient-light); border-radius: 8px;">
                    <p style="font-size: 0.9rem; margin: 0;"><i class="fas fa-lightbulb"></i> <strong>Dica inicial:</strong> Comece pelo capítulo 3 sobre autoconhecimento emocional</p>
                </div>
            `;
        }
        
        // Mostra o modal
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
    
    // Fechar modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            if (successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Fechar modal ao clicar fora
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Menu mobile toggle
    if (menuToggle && navMobile) {
        menuToggle.addEventListener('click', function() {
            navMobile.classList.toggle('active');
            menuToggle.innerHTML = navMobile.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Fechar menu ao clicar em um link
    document.querySelectorAll('.nav-mobile a').forEach(link => {
        link.addEventListener('click', function() {
            if (navMobile) {
                navMobile.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // FAQ - Funcionalidade
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(question => {
            question.addEventListener('click', function() {
                // Encontra a resposta correspondente
                const answer = this.nextElementSibling;
                const isOpen = answer.classList.contains('open');
                
                // Remove a classe 'open' de todas as respostas e 'active' de todas as perguntas
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.classList.remove('open');
                });
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                });
                
                // Se não estava aberta, abre
                if (!isOpen) {
                    answer.classList.add('open');
                    this.classList.add('active');
                }
            });
        });
    }
    
    // Countdown timer
    function updateCountdown() {
        if (!hoursElement || !minutesElement || !secondsElement) return;
        
        // Configura o countdown para 24 horas a partir do carregamento
        const now = new Date().getTime();
        const targetTime = localStorage.getItem('countdownTarget');
        
        let target;
        
        if (!targetTime) {
            // Se é a primeira visita, define o alvo para 24 horas no futuro
            target = now + 24 * 60 * 60 * 1000;
            localStorage.setItem('countdownTarget', target);
        } else {
            target = parseInt(targetTime);
            
            // Se já passou mais de 24 horas, reseta
            if (now > target) {
                target = now + 24 * 60 * 60 * 1000;
                localStorage.setItem('countdownTarget', target);
            }
        }
        
        const timeLeft = target - now;
        
        // Calcula horas, minutos e segundos
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Atualiza os elementos
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
        
        // Se o tempo acabou, mostra uma mensagem
        if (timeLeft < 0) {
            clearInterval(countdownInterval);
            const countdownElement = document.querySelector('.cta-countdown');
            if (countdownElement) {
                countdownElement.innerHTML = '<div style="color: white; font-size: 1.2rem; padding: 20px;">Últimas horas da oferta!</div>';
            }
        }
    }
    
    // Inicia o countdown
    let countdownInterval;
    if (hoursElement && minutesElement && secondsElement) {
        updateCountdown(); // Chamada inicial
        countdownInterval = setInterval(updateCountdown, 1000);
    }
    
    // Scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Fecha menu mobile se aberto
                if (navMobile && navMobile.classList.contains('active')) {
                    navMobile.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
                
                // Scroll suave
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Botão CTA que rola até o formulário
    const ctaButton = document.querySelector('.btn-cta');
    if (ctaButton && ctaButton.getAttribute('href') === '#leadForm') {
        ctaButton.addEventListener('click', function(e) {
            e.preventDefault();
            const formSection = document.getElementById('leadForm');
            if (formSection) {
                window.scrollTo({
                    top: formSection.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Dá foco no campo de nome
                setTimeout(() => {
                    const nameInput = document.getElementById('name');
                    if (nameInput) nameInput.focus();
                }, 500);
            }
        });
    }
    
    // Animações ao scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.benefit-card, .testimonial-card, .content-item');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Inicializa elementos animados
    document.querySelectorAll('.benefit-card, .testimonial-card, .content-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s, transform 0.5s';
    });
    
    // Verifica se o usuário já preencheu o formulário anteriormente
    const savedLeadData = localStorage.getItem('leadData');
    if (savedLeadData) {
        try {
            const data = JSON.parse(savedLeadData);
            const nameInput = document.getElementById('name');
            const phoneInput = document.getElementById('phone');
            
            if (nameInput) nameInput.value = data.name || '';
            if (phoneInput && data.phone) {
                phoneInput.value = data.phone;
            }
            
            // Se já tem dados, pode marcar o checkbox por padrão
            const termsCheckbox = document.getElementById('terms');
            if (termsCheckbox) {
                termsCheckbox.checked = true;
            }
            
        } catch (error) {
            console.log('Erro ao carregar dados salvos:', error);
        }
    }
    
    // Event listener para scroll
    window.addEventListener('scroll', animateOnScroll);
    
    // Inicializa animações
    setTimeout(animateOnScroll, 100);
    
    // Adiciona CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        .faq-answer {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .faq-answer.open {
            max-height: 500px;
        }
        
        .faq-question i {
            transition: transform 0.3s ease;
        }
        
        .faq-question.active i {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(style);
    
    console.log('Landing Page "Mulheres Emocionalmente Fortes" inicializada com WhatsApp obrigatório!');
});