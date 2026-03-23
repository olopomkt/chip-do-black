import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { ChevronRight, ShieldAlert, PlayCircle, CheckCircle2, AlertTriangle, ShieldCheck, Zap, XOctagon, Server, Cpu, Lock, X } from 'lucide-react';

type Step = 
  | 'cover'
  | 'q_role'
  | 'q_operation_type'
  | 'q_chips_current'
  | 'transition_to_video'
  | 'video_explanation'
  | 'api_explanation'
  | 'q_warmup_days'
  | 'q_frequency'
  | 'q_chips_to_warm'
  | 'terms_agreement'
  | 'lead_capture'
  | 'checkout_redirect';

const STEPS: Step[] = [
  'cover',
  'q_role',
  'q_operation_type',
  'q_chips_current',
  'transition_to_video',
  'video_explanation',
  'api_explanation',
  'q_warmup_days',
  'q_frequency',
  'q_chips_to_warm',
  'terms_agreement',
  'lead_capture',
  'checkout_redirect'
];

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [termsName, setTermsName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadId] = useState(() => crypto.randomUUID());
  const [userIp, setUserIp] = useState('');
  const [clickedOffers, setClickedOffers] = useState<Set<string>>(new Set());
  const [hasSentLeadWebhook, setHasSentLeadWebhook] = useState(false);

  React.useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(() => setUserIp('unknown'));
  }, []);

  const currentStep = STEPS[currentStepIndex];
  const progress = (currentStepIndex / (STEPS.length - 1)) * 100;
  
  const getThemeVars = (stepIndex: number) => {
    if (stepIndex <= 2) {
      // Azul (Frio)
      return {
        '--theme-bg': '#060d13',
        '--theme-color': '#00bfff',
        '--theme-color-light': '#80dfff',
        '--theme-color-dark': '#0059b3',
        '--theme-glow': 'rgba(0, 191, 255, 0.3)',
        '--theme-glow-strong': 'rgba(0, 191, 255, 0.5)',
        '--theme-glow-light': 'rgba(0, 191, 255, 0.1)',
      };
    } else if (stepIndex <= 4) {
      // Azul Escuro / Quase Preto
      return {
        '--theme-bg': '#050a14',
        '--theme-color': '#1a2639',
        '--theme-color-light': '#2c3e50',
        '--theme-color-dark': '#0d131c',
        '--theme-glow': 'rgba(26, 38, 57, 0.3)',
        '--theme-glow-strong': 'rgba(26, 38, 57, 0.5)',
        '--theme-glow-light': 'rgba(26, 38, 57, 0.1)',
      };
    } else if (stepIndex <= 6) {
      // Marrom Escuro
      return {
        '--theme-bg': '#140a00',
        '--theme-color': '#5c2e00',
        '--theme-color-light': '#8a4500',
        '--theme-color-dark': '#2e1700',
        '--theme-glow': 'rgba(92, 46, 0, 0.3)',
        '--theme-glow-strong': 'rgba(92, 46, 0, 0.5)',
        '--theme-glow-light': 'rgba(92, 46, 0, 0.1)',
      };
    } else if (stepIndex <= 9) {
      // Laranja Escuro (Quente)
      return {
        '--theme-bg': '#1a0a00',
        '--theme-color': '#e65c00',
        '--theme-color-light': '#ff8533',
        '--theme-color-dark': '#993d00',
        '--theme-glow': 'rgba(230, 92, 0, 0.3)',
        '--theme-glow-strong': 'rgba(230, 92, 0, 0.5)',
        '--theme-glow-light': 'rgba(230, 92, 0, 0.1)',
      };
    } else {
      // Laranja Brilhante (Muito Quente)
      return {
        '--theme-bg': '#1a0800',
        '--theme-color': '#ff6600',
        '--theme-color-light': '#ff994d',
        '--theme-color-dark': '#b34700',
        '--theme-glow': 'rgba(255, 102, 0, 0.3)',
        '--theme-glow-strong': 'rgba(255, 102, 0, 0.5)',
        '--theme-glow-light': 'rgba(255, 102, 0, 0.1)',
      };
    }
  };

  const nextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      if (STEPS[currentStepIndex] === 'q_chips_to_warm' && termsAccepted && leadName) {
        setCurrentStepIndex(STEPS.indexOf('checkout_redirect'));
        return;
      }
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    setTimeout(nextStep, 400);
  };

  const sendWebhook = async (offerName?: string, offerPrice?: number, offerDays?: string) => {
    const payload = {
      id_lead: leadId,
      ip_usuario: userIp,
      nome: leadName,
      email: leadEmail,
      telefone: leadPhone,
      perfil_atuacao: answers['role'],
      foco_operacao: answers['operation_type'],
      numeros_aquecidos_atualmente: answers['chips_current'],
      dias_aquecimento_desejado: answers['warmup_days'],
      frequencia_aquecimento: answers['frequency'],
      quantidade_numeros_desejada: answers['chips_to_warm'],
      termo_aceito: termsAccepted,
      nome_assinatura_termo: termsName,
      data_hora: new Date().toISOString(),
      oferta_selecionada: offerName ? {
        nome: offerName,
        preco: offerPrice,
        dias: offerDays
      } : null
    };

    try {
      await fetch('https://webhook.infinityacademyb2b.com.br/webhook/cdb-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Erro ao enviar webhook:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'cover':
        return (
          <motion.div 
            key="cover"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center space-y-8"
          >
            <Logo className="scale-110 md:scale-125 mb-4" />
            <div className="space-y-4 max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Aquecimento para suas Operações no 1x1 no WhatsApp
              </h2>
              <p className="text-blue-200/80 text-lg leading-relaxed">
                Diminua drasticamente as chances de bloqueio e suspensão do seu número. 
                Aqueça seus números do WhatsApp com uma automação inteligente e venda mais no 1x1 sem interrupções.
              </p>
            </div>
            <button 
              onClick={nextStep}
              className="group relative px-8 py-4 rounded-full font-bold text-lg text-white overflow-hidden transition-all duration-300"
              style={{ backgroundColor: 'var(--theme-color)', boxShadow: '0 0 40px var(--theme-glow)' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              <span className="relative flex items-center gap-2">
                VAMOS COMEÇAR <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        );

      case 'q_role':
        return <QuestionStep 
          key="q_role"
          question="Como você atua no mercado?"
          options={[
            "Sou Afiliado",
            "Sou Produtor",
            "Atuo como Ambos",
            "Agência / Coprodutor"
          ]}
          onSelect={(ans) => handleAnswer('role', ans)}
          selected={answers['role']}
        />;

      case 'q_operation_type':
        return <QuestionStep 
          key="q_operation_type"
          question="Suas operações são focadas no 1x1 (WhatsApp)?"
          options={[
            "100% focadas no 1x1",
            "A maioria é 1x1, mas tenho outras",
            "Dividido igualmente",
            "A maioria é automação / venda direta"
          ]}
          onSelect={(ans) => handleAnswer('operation_type', ans)}
          selected={answers['operation_type']}
        />;

      case 'q_chips_current':
        return <QuestionStep 
          key="q_chips_current"
          question="Quantos números do WhatsApp você já utiliza aquecidos no momento para suas operações?"
          options={[
            "Nenhum no momento",
            "1 a 5 números",
            "6 a 10 números",
            "11 a 20 números",
            "Mais de 20 números"
          ]}
          onSelect={(ans) => handleAnswer('chips_current', ans)}
          selected={answers['chips_current']}
        />;

      case 'transition_to_video':
        return (
          <motion.div 
            key="transition_to_video"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center justify-center text-center w-full max-w-3xl mx-auto space-y-8 min-h-[50vh]"
          >
            <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-10 h-10 text-blue-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Muito interessante a sua operação!
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
              O aquecimento de números do WhatsApp é extremamente importante pra evitar complicações futuras. Veja só como funciona:
            </p>
            <button 
              onClick={nextStep}
              className="mt-8 px-10 py-5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transform hover:-translate-y-1 flex items-center gap-3"
            >
              VER COMO FUNCIONA <PlayCircle className="w-6 h-6" />
            </button>
          </motion.div>
        );

      case 'video_explanation':
        return (
          <motion.div 
            key="video_explanation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center w-full max-w-3xl mx-auto space-y-6 md:space-y-8"
          >
            <div className="text-center space-y-2 md:space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Como a Mágica Acontece na Prática
              </h2>
              <p className="text-blue-300 text-sm md:text-base">
                Veja exatamente como o <strong className="text-cyan-400">CHIP DO BLACK</strong> vai blindar sua operação.
              </p>
            </div>
            
            <div className="w-full max-w-[320px] md:max-w-none aspect-[9/16] md:aspect-video bg-slate-900/80 rounded-2xl border border-slate-700 md:border-blue-500/30 shadow-lg md:shadow-[0_0_30px_rgba(0,85,255,0.15)] flex items-center justify-center relative overflow-hidden group mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-500/5 md:from-blue-600/20 md:to-cyan-500/10"></div>
              <PlayCircle className="w-16 h-16 md:w-20 md:h-20 text-cyan-400 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-center text-xs md:text-sm text-slate-400">
                [ Vídeo Explicativo será inserido aqui ]
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="w-full md:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors flex items-center justify-center gap-2"
            >
              PROSSEGUIR <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        );

      case 'api_explanation':
        return (
          <motion.div 
            key="api_explanation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col w-full max-w-3xl mx-auto space-y-8"
          >
            <div className="flex flex-col items-center text-center space-y-4 mb-2">
              <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 shadow-lg">
                <Server className="w-10 h-10 text-emerald-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                A Verdade sobre as APIs
              </h2>
              <p className="text-slate-400 max-w-xl">
                Entenda exatamente como conectamos seu WhatsApp e por que nossa tecnologia é diferente do mercado tradicional.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* API Oficial Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <XOctagon className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-200">API Oficial</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0"></div>
                    <span>Extremamente burocrática para aprovação.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0"></div>
                    <span>Custo elevado (você paga por cada mensagem enviada).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500/50 mt-1.5 shrink-0"></div>
                    <span><strong className="text-slate-300">Inviável</strong> para aquecimento agressivo e vendas 1x1 em escala.</span>
                  </li>
                </ul>
              </div>

              {/* API Não Oficial Card */}
              <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/50"></div>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full"></div>
                <div className="flex items-center gap-3 mb-4 relative">
                  <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                    <Zap className="w-6 h-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">API Não Oficial</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-300 relative">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_5px_#34d399]"></div>
                    <span>A tecnologia que nós utilizamos.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_5px_#34d399]"></div>
                    <span>Permite automação real e escalável.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0 shadow-[0_0_5px_#34d399]"></div>
                    <span><strong>Sem custos adicionais</strong> por mensagem enviada.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Diferencial Tecnológico */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 p-6 md:p-8 rounded-2xl relative overflow-hidden">
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full"></div>
              
              <div className="flex items-center gap-3 mb-4">
                <Cpu className="w-6 h-6 text-cyan-400" />
                <h4 className="text-lg font-bold text-white">Nosso Diferencial Tecnológico</h4>
              </div>
              
              <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                Trabalhamos com um sistema de <strong className="text-cyan-300">alta segurança inteligente</strong>, utilizando proxy rotativo e lógica complexa de IA para simular comportamento humano. Isso minimiza <strong className="text-emerald-400 text-lg">EXPONENCIALMENTE</strong> as chances de bloqueio ou suspensão do seu número. Até hoje, nossa taxa de números bloqueados é de <strong className="text-emerald-400">menos de 5%</strong>.
              </p>

              <div className="flex items-start gap-4 bg-black/40 border border-amber-500/20 p-4 rounded-xl">
                <div className="p-2 bg-amber-500/10 rounded-lg shrink-0">
                  <Lock className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-sm text-slate-400">
                  <strong className="text-amber-500 block mb-1">Seja Realista:</strong>
                  Independente da tecnologia, usando a API Não Oficial, ainda existe um pequeno risco de bloqueio. Nós minimizamos esse risco ao máximo, mas ele faz parte do jogo.
                </div>
              </div>
            </div>

            <button 
              onClick={nextStep}
              className="w-full py-5 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              ENTENDI COMO FUNCIONA
              <ChevronRight className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
            </button>
          </motion.div>
        );

      case 'q_warmup_days':
        return <QuestionStep 
          key="q_warmup_days"
          question="Quantos dias você quer ficar aquecendo o número do WhatsApp?"
          options={[
            "3 dias",
            "5 dias",
            "7 dias"
          ]}
          onSelect={(ans) => handleAnswer('warmup_days', ans)}
          selected={answers['warmup_days']}
        />;

      case 'q_frequency':
        return <QuestionStep 
          key="q_frequency"
          question="Qual a frequência de mensagens?"
          options={[
            "Rápido (Risco Alto)",
            "Neutro (Risco Moderado)",
            "Sem Pressa (Risco Baixo)"
          ]}
          onSelect={(ans) => handleAnswer('frequency', ans)}
          selected={answers['frequency']}
        />;

      case 'q_chips_to_warm':
        return <QuestionStep 
          key="q_chips_to_warm"
          question="Quantos números do WhatsApp você pretende aquecer com nossa automação?"
          options={[
            "Até 2 números",
            "Até 4 números",
            "Até 8 números"
          ]}
          onSelect={(ans) => handleAnswer('chips_to_warm', ans)}
          selected={answers['chips_to_warm']}
        />;

      case 'terms_agreement':
        return (
          <>
            <motion.div 
              key="terms_agreement"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col w-full max-w-3xl mx-auto space-y-6"
            >
              <div className="text-center space-y-2 mb-2">
                <ShieldAlert className="w-12 h-12 mx-auto mb-4 transition-colors duration-1000" style={{ color: 'var(--theme-color)' }} />
                <h2 className="text-2xl md:text-3xl font-bold text-white">Termo de Responsabilidade e Ciência de Riscos</h2>
                <p className="text-sm font-bold uppercase tracking-widest transition-colors duration-1000" style={{ color: 'var(--theme-color-light)' }}>Leitura e Aceite Obrigatórios</p>
              </div>

              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl">
                <div className="prose prose-invert prose-sm max-w-none text-slate-300 bg-slate-950/50 p-6 rounded-xl border border-slate-800 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
                  <h3 className="text-white font-bold text-lg mb-4">1. OBJETO DO TERMO</h3>
                  <p className="mb-4">
                    O presente termo tem como objetivo estabelecer as condições, limitações e isenções de responsabilidade referentes ao uso do sistema de automação e aquecimento de números de WhatsApp denominado "CHIP DO BLACK".
                  </p>
                  <p className="text-xs font-bold uppercase tracking-widest mt-8 text-center transition-colors duration-1000" style={{ color: 'var(--theme-color-light)' }}>
                    Clique no botão abaixo para ler o termo completo
                  </p>
                </div>

                <button 
                  onClick={() => setIsTermsModalOpen(true)}
                  className="w-full py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  ABRIR TERMO COMPLETO PARA ASSINAR
                </button>

                {/* Show signature status if signed */}
                {termsAccepted && termsName.trim().length >= 5 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-5 pt-6 border-t border-slate-800"
                  >
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3 mb-2">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                      <p className="text-emerald-400 font-bold text-sm uppercase tracking-wider">Termo Assinado Eletronicamente</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-400 mb-2">
                        Assinatura Eletrônica:
                      </label>
                      <input 
                        type="text" 
                        value={termsName}
                        disabled
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-300 opacity-80 cursor-not-allowed"
                      />
                    </div>

                    <label className="flex items-start gap-4 p-4 rounded-xl border border-slate-700 bg-slate-950/50 opacity-80 cursor-not-allowed">
                      <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          checked={termsAccepted}
                          disabled
                          className="peer sr-only"
                        />
                        <div className="w-6 h-6 bg-slate-900 border-2 border-slate-600 rounded peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-colors"></div>
                        <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm text-slate-400 leading-relaxed">
                        Declaro que li integralmente o Termo de Responsabilidade acima, compreendo os riscos de bloqueio inerentes ao uso de API Não Oficial e <strong>isento totalmente o CHIP DO BLACK de qualquer responsabilidade</strong> sobre a perda de números ou prejuízos decorrentes.
                      </span>
                    </label>
                  </motion.div>
                )}
              </div>

              <button 
                onClick={nextStep}
                disabled={!termsAccepted || termsName.trim().length < 5}
                className="w-full py-5 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all disabled:shadow-none uppercase"
                style={(!termsAccepted || termsName.trim().length < 5) ? {} : { backgroundColor: 'var(--theme-color)', boxShadow: '0 0 20px var(--theme-glow)' }}
              >
                {termsAccepted && termsName.trim().length >= 5 ? 'Assinado - Finalizar' : 'Assine o termo para continuar'}
              </button>
            </motion.div>

            {/* Modal */}
            <AnimatePresence>
              {isTermsModalOpen && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/60 backdrop-blur-md"
                >
                  <motion.div 
                    initial={{ scale: 0.95, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.95, y: 20 }}
                    className="bg-white w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                  >
                    <div className="p-5 md:p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                      <h2 className="text-lg md:text-xl font-bold text-slate-800">Termo de Responsabilidade</h2>
                      <button onClick={() => setIsTermsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    
                    <div className="p-5 md:p-8 overflow-y-auto custom-scrollbar text-slate-700 space-y-6 text-sm md:text-base bg-white leading-relaxed">
                      <h3 className="text-slate-900 font-bold text-lg">1. OBJETO DO TERMO</h3>
                      <p>O presente termo tem como objetivo estabelecer as condições, limitações e isenções de responsabilidade referentes ao uso do sistema de automação e aquecimento de números de WhatsApp denominado "CHIP DO BLACK". Ao prosseguir, o usuário declara ter lido, compreendido e aceito integralmente todas as cláusulas aqui dispostas.</p>

                      <h3 className="text-slate-900 font-bold text-lg mt-8">2. NATUREZA DA TECNOLOGIA E RISCOS INERENTES</h3>
                      <p><strong>2.1. Uso de API Não Oficial:</strong> O usuário declara estar ciente de que o serviço prestado utiliza a "API Não Oficial" do WhatsApp. Esta tecnologia, embora permita automação em escala e redução de custos, opera à margem das diretrizes oficiais da Meta (empresa controladora do WhatsApp).</p>
                      <p><strong>2.2. Risco de Suspensão:</strong> Fica expressamente estabelecido que <strong>NÃO EXISTE GARANTIA DE 100% DE IMUNIDADE</strong> contra bloqueios, banimentos ou suspensões de números utilizados na plataforma. O WhatsApp atualiza seus algoritmos de detecção de spam e automação de forma contínua e imprevisível.</p>

                      <h3 className="text-slate-900 font-bold text-lg mt-8">3. NOSSO COMPROMISSO E LIMITAÇÕES</h3>
                      <p><strong>3.1. Mitigação de Riscos:</strong> O CHIP DO BLACK compromete-se a fornecer tecnologia de ponta, incluindo inteligência artificial para simulação de comportamento humano, lógicas complexas de delay e uso de proxies rotativos, com o objetivo de minimizar exponencialmente as chances de bloqueio em comparação com automações amadoras.</p>
                      <p><strong>3.2. Ausência de Garantia de Resultado:</strong> A mitigação de riscos mencionada na cláusula 3.1 <strong>NÃO CONSTITUI PROMESSA OU GARANTIA</strong> de que o número não será banido. O bloqueio pode ocorrer independentemente da qualidade da automação, motivado por denúncias de usuários, histórico do IP, qualidade do número ou mudanças abruptas nas políticas da Meta.</p>

                      <h3 className="text-slate-900 font-bold text-lg mt-8">4. ISENÇÃO TOTAL DE RESPONSABILIDADE</h3>
                      <p className="text-red-600 font-medium"><strong>4.1. O CHIP DO BLACK, SEUS CRIADORES, DESENVOLVEDORES E REPRESENTANTES ESTÃO TOTALMENTE ISENTOS DE QUALQUER RESPONSABILIDADE CIVIL, MATERIAL OU MORAL DECORRENTE DE:</strong></p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Bloqueio temporário ou banimento permanente de números de WhatsApp conectados à nossa automação;</li>
                        <li>Perda de contatos, histórico de conversas, leads ou dados armazenados nos números afetados;</li>
                        <li>Prejuízos financeiros, lucros cessantes, perda de vendas ou danos à imagem da empresa do usuário decorrentes da indisponibilidade do número de WhatsApp;</li>
                        <li>Custos associados à aquisição de novos números (SIM cards) para reposição.</li>
                      </ul>

                      <h3 className="text-slate-900 font-bold text-lg mt-8">5. DECLARAÇÃO DE CIÊNCIA E ACEITE</h3>
                      <p className="mb-8">Ao preencher seu nome e marcar a caixa de seleção abaixo, o usuário firma este termo eletronicamente, declarando de forma irrevogável e irretratável que:<br/><br/><em className="text-slate-500">"Compreendo perfeitamente que operar com automação no WhatsApp envolve riscos calculados. Assumo total e exclusiva responsabilidade pelos números que conectarei ao sistema CHIP DO BLACK, isentando a plataforma de qualquer ônus em caso de bloqueios ou perdas."</em></p>

                      {/* Signature Area at the bottom of the scrollable content */}
                      <div className="mt-12 pt-8 border-t border-slate-200 space-y-6 bg-slate-50 -mx-5 md:-mx-8 -mb-5 md:-mb-8 p-5 md:p-8">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">
                            Assinatura Eletrônica (Digite seu nome completo):
                          </label>
                          <input 
                            type="text" 
                            value={termsName}
                            onChange={(e) => setTermsName(e.target.value)}
                            placeholder="Ex: João da Silva Santos"
                            className="w-full bg-white border border-slate-300 rounded-xl px-4 py-4 text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors shadow-sm"
                          />
                        </div>

                        <label className="flex items-start gap-4 cursor-pointer group bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors shadow-sm">
                          <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                            <input 
                              type="checkbox" 
                              checked={termsAccepted}
                              onChange={(e) => setTermsAccepted(e.target.checked)}
                              className="peer sr-only"
                            />
                            <div className="w-6 h-6 bg-white border-2 border-slate-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors"></div>
                            <CheckCircle2 className="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                          </div>
                          <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors leading-relaxed">
                            Declaro que li integralmente o Termo de Responsabilidade acima, compreendo os riscos de bloqueio inerentes ao uso de API Não Oficial e <strong>isento totalmente o CHIP DO BLACK de qualquer responsabilidade</strong> sobre a perda de números ou prejuízos decorrentes.
                          </span>
                        </label>

                        <button 
                          onClick={() => setIsTermsModalOpen(false)}
                          disabled={!termsAccepted || termsName.trim().length < 5}
                          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all shadow-lg disabled:shadow-none mt-4"
                        >
                          CONFIRMAR E FECHAR
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        );

      case 'lead_capture':
        return (
          <motion.div 
            key="lead_capture"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center w-full max-w-xl mx-auto space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Quase lá!
              </h2>
              <p className="transition-colors duration-1000" style={{ color: 'var(--theme-color-light)' }}>
                Preencha seus dados para liberar sua oferta exclusiva.
              </p>
            </div>
            
            <div className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Nome Completo</label>
                  <input 
                    type="text" 
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors duration-1000 focus:ring-1"
                    style={{ '--tw-ring-color': 'var(--theme-color)' } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">E-mail</label>
                  <input 
                    type="email" 
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors duration-1000 focus:ring-1"
                    style={{ '--tw-ring-color': 'var(--theme-color)' } as React.CSSProperties}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">WhatsApp Principal</label>
                  <input 
                    type="tel" 
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none transition-colors duration-1000 focus:ring-1"
                    style={{ '--tw-ring-color': 'var(--theme-color)' } as React.CSSProperties}
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  if (!hasSentLeadWebhook) {
                    sendWebhook();
                    setHasSentLeadWebhook(true);
                  }
                  nextStep();
                }}
                disabled={!leadName || !leadEmail || !leadPhone}
                className="w-full py-4 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all disabled:shadow-none flex items-center justify-center gap-2"
                style={(!leadName || !leadEmail || !leadPhone) ? {} : { backgroundColor: 'var(--theme-color)', boxShadow: '0 0 20px var(--theme-glow)' }}
              >
                VER PLANOS <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        );

      case 'checkout_redirect': {
        const chips = answers['chips_to_warm'] || 'Até 2 números';
        
        let plans = [];
        const extraInstancePrice = 27;

        if (chips === 'Até 2 números') {
          plans = [
            { name: 'Essencial', days: '3 dias', price: 47, link: 'https://pagamento.chipdoblack.online/checkout/v5/LwSCReMRQ7YXdI5SL9le' },
            { name: 'Profissional', days: '5 dias', price: 77, link: 'https://pagamento.chipdoblack.online/checkout/v5/aXLGIx0WApmFENoTcsL5' },
            { name: 'Intensivo', days: '7 dias', price: 107, link: 'https://pagamento.chipdoblack.online/checkout/v5/nYKFKBYQL5FK8yz26cZp' }
          ];
        } else if (chips === 'Até 4 números') {
          plans = [
            { name: 'Essencial', days: '3 dias', price: 87, link: 'https://pagamento.chipdoblack.online/checkout/v5/axaqIvUthvrIuVyh3eJB' },
            { name: 'Profissional', days: '5 dias', price: 117, link: 'https://pagamento.chipdoblack.online/checkout/v5/B72Y927EUI84rSC75po4' },
            { name: 'Intensivo', days: '7 dias', price: 147, link: 'https://pagamento.chipdoblack.online/checkout/v5/hDU23qRMqC9KYmMawYiJ' }
          ];
        } else if (chips === 'Até 8 números') {
          plans = [
            { name: 'Essencial', days: '3 dias', price: 127, link: 'https://pagamento.chipdoblack.online/checkout/v5/4PVri6x63Io43wfySZVe' },
            { name: 'Profissional', days: '5 dias', price: 157, link: 'https://pagamento.chipdoblack.online/checkout/v5/4IFehiQFKsXVTn8Bi0oH' },
            { name: 'Intensivo', days: '7 dias', price: 187, link: 'https://pagamento.chipdoblack.online/checkout/v5/wroWzragzSkYLZDXvZuv' }
          ];
        }

        return (
          <motion.div 
            key="checkout_redirect"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center w-full max-w-5xl mx-auto space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Tudo Pronto!</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Sua operação está prestes a subir de nível. Baseado na sua escolha de {chips}, veja os planos ideais para você:
              </p>
            </div>

            <div className="w-full space-y-8 mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {plans.map((plan, idx) => (
                    <div key={idx} className={`bg-slate-900 border ${plan.name === 'Profissional' ? 'md:-translate-y-4 flame-effect' : 'border-slate-700'} rounded-2xl p-6 md:p-8 flex flex-col relative transition-transform duration-1000`}>
                      {plan.name === 'Profissional' && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-slate-900 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider transition-colors duration-1000" style={{ backgroundColor: 'var(--theme-color)' }}>
                          Mais Escolhido
                        </div>
                      )}
                      <h3 className="text-2xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="font-medium mb-6 transition-colors duration-1000" style={{ color: 'var(--theme-color-light)' }}>Aquecimento de {plan.days}</p>
                      
                      <div className="mb-8">
                        <span className="text-sm text-slate-400">R$</span>
                        <span className="text-5xl font-black text-white ml-1">{plan.price}</span>
                      </div>

                      <ul className="space-y-4 mb-8 text-left text-sm text-slate-300 flex-1">
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0 transition-colors duration-1000" style={{ color: 'var(--theme-color)' }} />
                          <span>Aquecimento inteligente</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0 transition-colors duration-1000" style={{ color: 'var(--theme-color)' }} />
                          <span>Suporte especializado</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 shrink-0 transition-colors duration-1000" style={{ color: 'var(--theme-color)' }} />
                          <span>{chips}</span>
                        </li>
                      </ul>

                      <button 
                        onClick={async () => {
                          const offerKey = `${plan.name}-${plan.days}`;
                          if (!clickedOffers.has(offerKey)) {
                            await sendWebhook(plan.name, plan.price, plan.days);
                            setClickedOffers(prev => new Set(prev).add(offerKey));
                          }
                          window.location.href = plan.link;
                        }}
                        className={`w-full py-4 rounded-xl font-bold transition-all ${plan.name === 'Profissional' ? 'text-slate-900 shadow-lg' : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                        style={plan.name === 'Profissional' ? { backgroundColor: 'var(--theme-color)' } : {}}
                      >
                        ASSINAR AGORA
                      </button>
                    </div>
                  ))}
                </div>
                
                <p className="text-slate-400 text-sm mt-8">
                  Precisa de mais? Instância adicional por apenas <strong className="text-white">R$ {extraInstancePrice}</strong>.
                </p>
              </div>

            <button
              onClick={() => setCurrentStepIndex(STEPS.indexOf('q_chips_to_warm'))}
              className="mt-8 hover:text-white transition-colors text-sm font-medium underline underline-offset-4 duration-1000"
              style={{ color: 'var(--theme-color-light)' }}
            >
              Ver outra oferta (Alterar quantidade de números)
            </button>
          </motion.div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen text-slate-50 overflow-hidden relative font-sans transition-colors duration-1000 selection:bg-white/20"
      style={{ 
        backgroundColor: 'var(--theme-bg)',
        ...getThemeVars(currentStepIndex)
      } as React.CSSProperties}
    >
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full mix-blend-screen transition-colors duration-1000" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] blur-[120px] rounded-full mix-blend-screen transition-colors duration-1000" style={{ backgroundColor: 'var(--theme-glow)' }}></div>
        <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] blur-[100px] rounded-full mix-blend-screen transition-colors duration-1000" style={{ backgroundColor: 'var(--theme-glow-strong)' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header / Progress */}
        {currentStepIndex > 0 && (
          <header className="w-full p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Logo className="scale-50 origin-left -ml-4" />
              <div className="text-xs font-bold tracking-widest uppercase transition-colors duration-1000" style={{ color: 'var(--theme-color)' }}>
                Passo {currentStepIndex} de {STEPS.length - 1}
              </div>
            </div>
            <div className="w-full h-1.5 bg-slate-800/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full transition-colors duration-1000"
                style={{ backgroundColor: 'var(--theme-color)', boxShadow: '0 0 10px var(--theme-glow-strong)' }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </header>
        )}

        {/* Quiz Container */}
        <main className="flex-1 flex items-center justify-center p-6 pb-20 w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="w-full py-6 text-center text-slate-500 text-xs md:text-sm border-t border-slate-800/30 bg-[#050b14]/50 backdrop-blur-sm mt-auto">
          <p>&copy; {new Date().getFullYear()} CHIP DO BLACK. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
}

// Reusable Question Component
const QuestionStep: React.FC<{ 
  question: string; 
  options: string[]; 
  onSelect: (ans: string) => void;
  selected?: string;
}> = ({ 
  question, 
  options, 
  onSelect, 
  selected 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-2xl mx-auto flex flex-col space-y-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight text-center md:text-left">
        {question}
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        {options.map((option, idx) => {
          const isSelected = selected === option;
          return (
            <button
              key={idx}
              onClick={() => onSelect(option)}
              className={`
                relative w-full p-5 rounded-xl border text-left transition-all duration-300 overflow-hidden group
                ${isSelected 
                  ? 'bg-slate-900/80' 
                  : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800/80'
                }
              `}
              style={isSelected ? {
                borderColor: 'var(--theme-color)',
                boxShadow: '0 0 20px var(--theme-glow)'
              } : {}}
            >
              <div 
                className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}
                style={{ background: 'linear-gradient(to right, var(--theme-glow-light), transparent)' }}
              ></div>
              <div className="relative flex items-center justify-between">
                <span 
                  className={`font-medium text-lg transition-colors duration-300 ${isSelected ? '' : 'text-slate-200 group-hover:text-white'}`}
                  style={isSelected ? { color: 'var(--theme-color-light)' } : {}}
                >
                  {option}
                </span>
                <div 
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300`}
                  style={isSelected ? { borderColor: 'var(--theme-color)' } : { borderColor: 'rgb(71 85 105)' }}
                >
                  {isSelected && <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--theme-color)', boxShadow: '0 0 10px var(--theme-glow-strong)' }} />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
