import { useState, useCallback } from "react";

/* ════════════════════════════════════════════
   CONSTANTS & PALETTE
   ════════════════════════════════════════════ */
const C = {
  bg: "#0a1628", sidebar: "#102044", sidebarHover: "#1a3060",
  accent: "#c9a84c", accentBright: "#ddc175", accentDim: "#a8893a",
  surface: "#f7f8fa", paper: "#ffffff",
  text: "#1a2744", muted: "#5a6a82", light: "#8a9ab2",
  border: "#d6dce6", borderDark: "#1e3a6a",
  green: "#34d399", greenDim: "#065f46",
  warn: "#fbbf24", warnBg: "#fffbeb",
  red: "#f87171",
  navy: "#163172", gold: "#c9a84c", goldLight: "#ddc175",
};

/* ════════════════════════════════════════════
   DEFAULT CONTRACT DATA — PRESTAÇÃO DE SERVIÇOS CONTÁBEIS
   ════════════════════════════════════════════ */
const DEFAULT_DATA_PRESTACAO = {
  // Contratante
  ct_razao: "",
  ct_cnpj: "",
  ct_endereco: "",
  ct_cep: "",
  ct_socio_nome: "",
  ct_socio_nacionalidade: "",
  ct_socio_profissao: "",
  ct_socio_estado_civil: "",
  ct_socio_cpf: "",
  // Contratada (pré-preenchido)
  cd_razao: "CONTABILIDADE ESSENCIAL LTDA",
  cd_fantasia: "ESSENCIAL CONTABILIDADE",
  cd_endereco: "Rua Anunciação, nº 218, Bairro São José, Belo Horizonte, MG",
  cd_cep: "30.820-160",
  cd_cnpj: "11.154.925/0001-03",
  cd_crc: "MG-012.577/O",
  cd_socia_nome: "Ana Lúcia Gonçalves",
  cd_socia_nacionalidade: "brasileira",
  cd_socia_profissao: "contadora",
  cd_socia_estado_civil: "união estável",
  cd_socia_cpf: "762.792.436-72",
  // Emails
  email_pessoal: "pessoal.essencialcontabilidade@gmail.com",
  email_contabil: "ana.essencialcontabilidade@gmail.com",
  // Prazos de envio
  prazo_folha: "01 (um)",
  prazo_docs: "05 (cinco)",
  // Financeiro
  fin_honorarios: "",
  fin_honorarios_extenso: "",
  fin_vencimento: "",
  // Vigência
  vig_inicio: "",
  vig_local_data: "Belo Horizonte,",
  vig_foro: "Belo Horizonte/MG",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — PRESTAÇÃO DE SERVIÇOS
   ════════════════════════════════════════════ */
const FIELD_GROUPS_PRESTACAO = [
  {
    title: "Dados da Empresa Contratante",
    icon: "🏢",
    fields: [
      { id: "ct_razao", label: "Razão Social", type: "text", ph: "Ex: EMPRESA LTDA" },
      { id: "ct_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "ct_endereco", label: "Endereço Completo", type: "text", ph: "Av./Rua, nº, Bairro, Cidade/UF" },
      { id: "ct_cep", label: "CEP", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Dados do Sócio / Representante",
    icon: "👤",
    fields: [
      { id: "ct_socio_nome", label: "Nome Completo", type: "text", ph: "Nome do sócio administrador" },
      { id: "ct_socio_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileiro" },
      { id: "ct_socio_profissao", label: "Profissão", type: "text", ph: "Ex: empresário" },
      { id: "ct_socio_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: casado" },
      { id: "ct_socio_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
    ]
  },
  {
    title: "Honorários e Vigência",
    icon: "💰",
    fields: [
      { id: "fin_honorarios", label: "Honorários Mensais (R$)", type: "text", ph: "Ex: 759,00" },
      { id: "fin_honorarios_extenso", label: "Honorários por Extenso", type: "text", ph: "Ex: setecentos e cinquenta e nove reais" },
      { id: "fin_vencimento", label: "Vencimento a partir de", type: "text", ph: "Ex: 10/11/2025" },
      { id: "vig_inicio", label: "Início do Contrato", type: "text", ph: "Ex: 01/10/2025" },
      { id: "vig_local_data", label: "Local e Data da Assinatura", type: "text", ph: "Ex: Belo Horizonte, 01 de outubro de 2025" },
      { id: "vig_foro", label: "Foro", type: "text", ph: "Belo Horizonte/MG" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSE DEFINITIONS
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_PRESTACAO = [
  { icon: "📋", label: "Objeto", id: "clausula-1" },
  { icon: "📊", label: "Áreas de Serviço", id: "clausula-2" },
  { icon: "🔒", label: "Responsabilidade Técnica", id: "clausula-3" },
  { icon: "📁", label: "Documentação", id: "clausula-4" },
  { icon: "⚖️", label: "Orientações", id: "clausula-5" },
  { icon: "📄", label: "Obrigações do Contratado", id: "clausula-6" },
  { icon: "💰", label: "Honorários", id: "clausula-7" },
  { icon: "🎄", label: "13º Honorário", id: "clausula-8" },
  { icon: "📈", label: "Manutenção Mensal", id: "clausula-9" },
  { icon: "🏥", label: "Equiparação Hospitalar", id: "clausula-10" },
  { icon: "⏰", label: "Multa por Atraso", id: "clausula-11" },
  { icon: "🔧", label: "Serviços Extraordinários", id: "clausula-12" },
  { icon: "📅", label: "Vigência e Rescisão", id: "clausula-13" },
  { icon: "📖", label: "Casos Omissos", id: "clausula-14" },
  { icon: "⚖️", label: "Foro", id: "clausula-15" },
];

/* ════════════════════════════════════════════
   DEFAULT DATA — CONTRATO DE PARCERIA SALÃO
   ════════════════════════════════════════════ */
const DEFAULT_DATA_PARCERIA = {
  // Salão-Parceiro
  sp_razao: "",
  sp_cnpj: "",
  sp_endereco: "",
  sp_numero: "",
  sp_bairro: "",
  sp_cidade_uf: "",
  sp_cep: "",
  sp_telefone: "",
  sp_email: "",
  // Sócio 1
  sp_socio1_nome: "",
  sp_socio1_nacionalidade: "brasileiro(a)",
  sp_socio1_estado_civil: "",
  sp_socio1_profissao: "",
  sp_socio1_cpf: "",
  sp_socio1_rg: "",
  sp_socio1_endereco: "",
  sp_socio1_numero: "",
  sp_socio1_bairro: "",
  sp_socio1_cidade_uf: "",
  sp_socio1_cep: "",
  // Profissional-Parceiro
  pp_nome: "",
  pp_nacionalidade: "brasileiro(a)",
  pp_estado_civil: "",
  pp_profissao: "",
  pp_cpf: "",
  pp_cnpj_mei: "",
  pp_endereco: "",
  pp_numero: "",
  pp_bairro: "",
  pp_cidade_uf: "",
  pp_cep: "",
  pp_telefone: "",
  pp_email: "",
  // Condições
  cond_servicos: "",
  cond_tabela_servico1: "",
  cond_tabela_parceiro1: "",
  cond_tabela_salao1: "",
  cond_tabela_servico2: "",
  cond_tabela_parceiro2: "",
  cond_tabela_salao2: "",
  cond_tabela_servico3: "",
  cond_tabela_parceiro3: "",
  cond_tabela_salao3: "",
  cond_dia_pagamento: "",
  cond_comissao_produtos: "",
  cond_comissao_produtos_extenso: "",
  // Vigência
  vig_cidade_uf: "",
  vig_dia: "",
  vig_mes: "",
  vig_ano: "",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — PARCERIA SALÃO
   ════════════════════════════════════════════ */
const FIELD_GROUPS_PARCERIA = [
  {
    title: "Dados do Salão-Parceiro",
    icon: "💇",
    fields: [
      { id: "sp_razao", label: "Razão Social", type: "text", ph: "Nome da empresa" },
      { id: "sp_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "sp_endereco", label: "Endereço (Rua/Av.)", type: "text", ph: "Rua/Av." },
      { id: "sp_numero", label: "Número", type: "text", ph: "nº" },
      { id: "sp_bairro", label: "Bairro", type: "text", ph: "Bairro" },
      { id: "sp_cidade_uf", label: "Cidade/UF", type: "text", ph: "Ex: Belo Horizonte/MG" },
      { id: "sp_cep", label: "CEP", type: "text", ph: "00000-000" },
      { id: "sp_telefone", label: "Telefone", type: "text", ph: "(00) 00000-0000" },
      { id: "sp_email", label: "E-mail", type: "text", ph: "email@email.com" },
    ]
  },
  {
    title: "Sócio(a) Administrador(a) 1",
    icon: "👤",
    fields: [
      { id: "sp_socio1_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) sócio(a)" },
      { id: "sp_socio1_nacionalidade", label: "Nacionalidade", type: "text", ph: "brasileiro(a)" },
      { id: "sp_socio1_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: casado(a)" },
      { id: "sp_socio1_profissao", label: "Profissão", type: "text", ph: "Ex: empresário(a)" },
      { id: "sp_socio1_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "sp_socio1_rg", label: "RG", type: "text", ph: "Número do RG" },
      { id: "sp_socio1_endereco", label: "Endereço", type: "text", ph: "Rua, nº" },
      { id: "sp_socio1_numero", label: "Número", type: "text", ph: "nº" },
      { id: "sp_socio1_bairro", label: "Bairro", type: "text", ph: "Bairro" },
      { id: "sp_socio1_cidade_uf", label: "Cidade/UF", type: "text", ph: "Cidade/UF" },
      { id: "sp_socio1_cep", label: "CEP", type: "text", ph: "00000-000" },
    ]
  },
  {
    title: "Dados do Profissional-Parceiro",
    icon: "✂️",
    fields: [
      { id: "pp_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) profissional" },
      { id: "pp_nacionalidade", label: "Nacionalidade", type: "text", ph: "brasileiro(a)" },
      { id: "pp_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: solteiro(a)" },
      { id: "pp_profissao", label: "Profissão", type: "text", ph: "Ex: cabeleireiro(a)" },
      { id: "pp_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "pp_cnpj_mei", label: "CNPJ (MEI)", type: "text", ph: "00.000.000/0000-00" },
      { id: "pp_endereco", label: "Endereço (Rua/Av.)", type: "text", ph: "Rua/Av." },
      { id: "pp_numero", label: "Número", type: "text", ph: "nº" },
      { id: "pp_bairro", label: "Bairro", type: "text", ph: "Bairro" },
      { id: "pp_cidade_uf", label: "Cidade/UF", type: "text", ph: "Cidade/UF" },
      { id: "pp_cep", label: "CEP", type: "text", ph: "00000-000" },
      { id: "pp_telefone", label: "Fone/Cel.", type: "text", ph: "(00) 00000-0000" },
      { id: "pp_email", label: "E-mail", type: "text", ph: "email@email.com" },
    ]
  },
  {
    title: "Objeto e Condições",
    icon: "📋",
    fields: [
      { id: "cond_servicos", label: "Serviços prestados (Cláusula 1ª)", type: "text", ph: "Ex: corte, coloração, escova..." },
      { id: "cond_dia_pagamento", label: "Dia(s) de pagamento (Cláusula 4ª)", type: "text", ph: "Ex: 5 e 20" },
      { id: "cond_comissao_produtos", label: "Comissão prod. vendidos (%)", type: "text", ph: "Ex: 10", hint: "Opcional — preencha apenas se houver comissão por produtos. A cláusula só aparecerá no contrato se este campo for preenchido." },
      { id: "cond_comissao_produtos_extenso", label: "Comissão por extenso", type: "text", ph: "Ex: dez por cento" },
    ]
  },
  {
    title: "Tabela de Serviços e Comissões",
    icon: "📊",
    fields: [
      { id: "cond_tabela_servico1", label: "Serviço 1", type: "text", ph: "Ex: Corte" },
      { id: "cond_tabela_parceiro1", label: "% Parceiro", type: "text", ph: "Ex: 60" },
      { id: "cond_tabela_salao1", label: "% Salão", type: "text", ph: "Ex: 40" },
      { id: "cond_tabela_servico2", label: "Serviço 2", type: "text", ph: "Ex: Coloração" },
      { id: "cond_tabela_parceiro2", label: "% Parceiro", type: "text", ph: "Ex: 55" },
      { id: "cond_tabela_salao2", label: "% Salão", type: "text", ph: "Ex: 45" },
      { id: "cond_tabela_servico3", label: "Serviço 3", type: "text", ph: "Ex: Escova" },
      { id: "cond_tabela_parceiro3", label: "% Parceiro", type: "text", ph: "Ex: 60" },
      { id: "cond_tabela_salao3", label: "% Salão", type: "text", ph: "Ex: 40" },
    ]
  },
  {
    title: "Local e Data de Assinatura",
    icon: "📅",
    fields: [
      { id: "vig_cidade_uf", label: "Cidade/UF", type: "text", ph: "Ex: Belo Horizonte/MG" },
      { id: "vig_dia", label: "Dia", type: "text", ph: "Ex: 01" },
      { id: "vig_mes", label: "Mês", type: "text", ph: "Ex: janeiro" },
      { id: "vig_ano", label: "Ano", type: "text", ph: "Ex: 2026" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSES — PARCERIA SALÃO
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_PARCERIA = [
  { icon: "👥", label: "Das Partes", id: "pc-1" },
  { icon: "📋", label: "Objeto", id: "pc-2" },
  { icon: "💰", label: "Percentuais e Repasse", id: "pc-3" },
  { icon: "🏢", label: "Material e Espaço", id: "pc-4" },
  { icon: "📅", label: "Agenda e Horários", id: "pc-5" },
  { icon: "✂️", label: "Obrig. Profissional", id: "pc-6" },
  { icon: "💇", label: "Obrig. Salão", id: "pc-7" },
  { icon: "📸", label: "Propaganda e Imagem", id: "pc-8" },
  { icon: "⚠️", label: "Danos a Terceiros", id: "pc-9" },
  { icon: "🚫", label: "Inexist. Vínculo", id: "pc-10" },
  { icon: "📅", label: "Vigência e Rescisão", id: "pc-11" },
  { icon: "🔄", label: "Cessão/Transferência", id: "pc-12" },
  { icon: "📖", label: "Disposições Gerais", id: "pc-13" },
  { icon: "⚖️", label: "Foro", id: "pc-14" },
];

/* ════════════════════════════════════════════
   DEFAULT DATA — CONTRATO SOCIAL
   ════════════════════════════════════════════ */
const DEFAULT_DATA_SOCIAL = {
  // Empresa
  emp_denominacao: "",
  emp_endereco: "",
  emp_cep: "",
  emp_objeto_1: "",
  emp_objeto_2: "",
  emp_objeto_3: "",
  // Capital
  cap_total: "",
  cap_total_extenso: "",
  cap_num_quotas: "",
  cap_num_quotas_extenso: "",
  cap_valor_quota: "",
  cap_valor_quota_extenso: "",
  // Sócio 1
  s1_nome: "",
  s1_nacionalidade: "",
  s1_nascido_exterior: "",
  s1_estado_civil: "",
  s1_profissao: "",
  s1_nascimento: "",
  s1_cpf: "",
  s1_rg: "",
  s1_endereco: "",
  s1_cep: "",
  s1_quotas: "",
  s1_valor: "",
  s1_percentual: "",
  // Sócio 2
  s2_nome: "",
  s2_nacionalidade: "",
  s2_nascido_exterior: "",
  s2_estado_civil: "",
  s2_profissao: "",
  s2_nascimento: "",
  s2_cpf: "",
  s2_rg: "",
  s2_endereco: "",
  s2_cep: "",
  s2_quotas: "",
  s2_valor: "",
  s2_percentual: "",
  // Administração
  adm_nome: "",
  adm_prolabore: "A administradora poderá retirar pró-labore em valor fixado de comum acordo entre as sócias, observada a legislação vigente.",
  // Enquadramento
  enq_tipo: "ME",
  // Haveres
  hav_parcelas: "24 (vinte e quatro)",
  hav_indice: "IPCA",
  // Retirada
  ret_prazo_dias: "60 (sessenta)",
  // Vigência
  vig_local_data: "",
  vig_foro: "Belo Horizonte/MG",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — CONTRATO SOCIAL
   ════════════════════════════════════════════ */
const FIELD_GROUPS_SOCIAL = [
  {
    title: "Dados da Empresa",
    icon: "🏢",
    fields: [
      { id: "emp_denominacao", label: "Denominação Social", type: "text", ph: "Ex: EMPRESA INVESTIMENTOS LTDA" },
      { id: "emp_endereco", label: "Endereço da Sede", type: "text", ph: "Rua, nº, apto, bairro, cidade/UF" },
      { id: "emp_cep", label: "CEP", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Objeto Social",
    icon: "📋",
    fields: [
      { id: "emp_objeto_1", label: "Objeto I", type: "text", ph: "Ex: Participação no capital de outras sociedades..." },
      { id: "emp_objeto_2", label: "Objeto II", type: "text", ph: "Ex: Realização de investimentos e aplicações..." },
      { id: "emp_objeto_3", label: "Objeto III", type: "text", ph: "Ex: Administração e exploração de bens próprios..." },
    ]
  },
  {
    title: "Capital Social",
    icon: "💰",
    fields: [
      { id: "cap_total", label: "Capital Total (R$)", type: "text", ph: "Ex: 8.000,00" },
      { id: "cap_total_extenso", label: "Capital por Extenso", type: "text", ph: "Ex: oito mil reais" },
      { id: "cap_num_quotas", label: "Nº Total de Quotas", type: "text", ph: "Ex: 80" },
      { id: "cap_num_quotas_extenso", label: "Nº Quotas por Extenso", type: "text", ph: "Ex: oitenta" },
      { id: "cap_valor_quota", label: "Valor por Quota (R$)", type: "text", ph: "Ex: 100,00" },
      { id: "cap_valor_quota_extenso", label: "Valor Quota por Extenso", type: "text", ph: "Ex: cem reais" },
    ]
  },
  {
    title: "Sócio(a) 1",
    icon: "👤",
    fields: [
      { id: "s1_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) sócio(a)" },
      { id: "s1_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileira" },
      { id: "s1_nascido_exterior", label: "Nascido(a) no exterior?", type: "text", ph: "Ex: nascida no exterior (ou deixe vazio)" },
      { id: "s1_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: casada sob regime de separação total de bens" },
      { id: "s1_profissao", label: "Profissão", type: "text", ph: "Ex: analista" },
      { id: "s1_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 26/11/1977" },
      { id: "s1_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "s1_rg", label: "RG / Identidade", type: "text", ph: "Ex: 8774239 – PC/MG" },
      { id: "s1_endereco", label: "Endereço Completo", type: "text", ph: "Rua, nº, apto, bairro, cidade/UF" },
      { id: "s1_cep", label: "CEP", type: "text", ph: "00.000-000" },
      { id: "s1_quotas", label: "Nº de Quotas", type: "text", ph: "Ex: 40" },
      { id: "s1_valor", label: "Valor das Quotas (R$)", type: "text", ph: "Ex: 4.000,00" },
      { id: "s1_percentual", label: "Percentual (%)", type: "text", ph: "Ex: 50" },
    ]
  },
  {
    title: "Sócio(a) 2",
    icon: "👤",
    fields: [
      { id: "s2_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) sócio(a)" },
      { id: "s2_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileira" },
      { id: "s2_nascido_exterior", label: "Nascido(a) no exterior?", type: "text", ph: "Ex: nascida no exterior (ou deixe vazio)" },
      { id: "s2_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: solteira" },
      { id: "s2_profissao", label: "Profissão", type: "text", ph: "Ex: estudante" },
      { id: "s2_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 07/12/2004" },
      { id: "s2_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "s2_rg", label: "RG / Identidade", type: "text", ph: "Ex: 17.832.251 – PC/MG" },
      { id: "s2_endereco", label: "Endereço Completo", type: "text", ph: "Rua, nº, apto, bairro, cidade/UF" },
      { id: "s2_cep", label: "CEP", type: "text", ph: "00.000-000" },
      { id: "s2_quotas", label: "Nº de Quotas", type: "text", ph: "Ex: 40" },
      { id: "s2_valor", label: "Valor das Quotas (R$)", type: "text", ph: "Ex: 4.000,00" },
      { id: "s2_percentual", label: "Percentual (%)", type: "text", ph: "Ex: 50" },
    ]
  },
  {
    title: "Administração e Condições",
    icon: "⚙️",
    fields: [
      { id: "adm_nome", label: "Administrador(a)", type: "text", ph: "Nome de quem administra" },
      { id: "enq_tipo", label: "Enquadramento", type: "select", opts: [
        { value: "ME", label: "Microempresa (ME)" },
        { value: "EPP", label: "Empresa de Pequeno Porte (EPP)" },
      ]},
      { id: "ret_prazo_dias", label: "Prazo p/ retirada (dias)", type: "text", ph: "Ex: 60 (sessenta)" },
      { id: "hav_parcelas", label: "Parcelas p/ haveres", type: "text", ph: "Ex: 24 (vinte e quatro)" },
      { id: "hav_indice", label: "Índice de correção", type: "text", ph: "Ex: IPCA" },
      { id: "vig_foro", label: "Foro", type: "text", ph: "Belo Horizonte/MG" },
      { id: "vig_local_data", label: "Local e Data", type: "text", ph: "Ex: Belo Horizonte/MG, 02 de março de 2026" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSES — CONTRATO SOCIAL
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_SOCIAL = [
  { icon: "🏢", label: "Denominação e Sede", id: "cs-1" },
  { icon: "📋", label: "Objeto Social", id: "cs-2" },
  { icon: "💰", label: "Capital Social", id: "cs-3" },
  { icon: "⚙️", label: "Administração", id: "cs-4" },
  { icon: "💵", label: "Pró-Labore", id: "cs-5" },
  { icon: "📊", label: "Enquadramento", id: "cs-6" },
  { icon: "📅", label: "Exercício Social", id: "cs-7" },
  { icon: "🔄", label: "Cessão de Quotas", id: "cs-8" },
  { icon: "🔒", label: "Incomunicabilidade", id: "cs-9" },
  { icon: "🚪", label: "Retirada", id: "cs-10" },
  { icon: "📐", label: "Apuração de Haveres", id: "cs-11" },
  { icon: "⚰️", label: "Falecimento", id: "cs-12" },
  { icon: "⚖️", label: "Credores Particulares", id: "cs-13" },
  { icon: "🏛️", label: "Foro", id: "cs-14" },
];

/* ════════════════════════════════════════════
   DEFAULT DATA — CONTRATO SOCIAL CABELEIREIRO (TRANSFORMAÇÃO)
   ════════════════════════════════════════════ */
const DEFAULT_DATA_CABELEIREIRO = {
  // Sócio
  sc_nome: "",
  sc_nacionalidade: "brasileiro",
  sc_estado_civil: "",
  sc_profissao: "",
  sc_nascimento: "",
  sc_rg: "",
  sc_rg_orgao: "",
  sc_cpf: "",
  sc_endereco: "",
  sc_cep: "",
  // Empresa original (empresário individual)
  eo_sede: "",
  eo_cep_sede: "",
  eo_nire: "",
  eo_razao: "",
  eo_data_registro: "",
  eo_cnpj: "",
  // Nova empresa
  ne_razao: "",
  ne_sede: "",
  ne_cep_sede: "",
  ne_objeto: "",
  ne_porte: "ME",
  // Capital
  cap_total: "",
  cap_total_extenso: "",
  cap_num_quotas: "",
  cap_num_quotas_extenso: "",
  cap_valor_quota: "",
  cap_valor_quota_extenso: "",
  cap_quotas_socio: "",
  // Administração
  adm_nome: "",
  // Vigência
  vig_data_inicio: "",
  vig_local_data: "",
  vig_foro: "Belo Horizonte",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — CONTRATO SOCIAL CABELEIREIRO
   ════════════════════════════════════════════ */
const FIELD_GROUPS_CABELEIREIRO = [
  {
    title: "Dados do Sócio",
    icon: "👤",
    fields: [
      { id: "sc_nome", label: "Nome Completo", type: "text", ph: "Nome completo" },
      { id: "sc_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileiro" },
      { id: "sc_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: solteiro" },
      { id: "sc_profissao", label: "Profissão", type: "text", ph: "Ex: Cabeleireiro" },
      { id: "sc_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 24/09/1991" },
      { id: "sc_rg", label: "RG (número)", type: "text", ph: "Ex: 14901860" },
      { id: "sc_rg_orgao", label: "Órgão Emissor", type: "text", ph: "Ex: SSP-MG" },
      { id: "sc_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "sc_endereco", label: "Endereço Residencial", type: "text", ph: "Rua, nº, apto, bairro, cidade/UF" },
      { id: "sc_cep", label: "CEP Residencial", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Empresa Original (Empresário Individual)",
    icon: "📄",
    fields: [
      { id: "eo_razao", label: "Razão Social Original", type: "text", ph: "Ex: NOME COMPLETO CPF" },
      { id: "eo_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "eo_sede", label: "Sede (Endereço)", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "eo_cep_sede", label: "CEP da Sede", type: "text", ph: "00.000-000" },
      { id: "eo_nire", label: "NIRE", type: "text", ph: "Ex: 31809910883" },
      { id: "eo_data_registro", label: "Data de Registro", type: "text", ph: "Ex: 23/03/2017" },
    ]
  },
  {
    title: "Nova Empresa (Sociedade Limitada)",
    icon: "🏢",
    fields: [
      { id: "ne_razao", label: "Nova Razão Social", type: "text", ph: "Ex: NOME CABELO & BELEZA LTDA" },
      { id: "ne_sede", label: "Nova Sede (Endereço)", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "ne_cep_sede", label: "CEP da Nova Sede", type: "text", ph: "00.000-000" },
      { id: "ne_objeto", label: "Objeto Social", type: "text", ph: "Ex: prestação de serviços de cabeleireiro, estética e cuidados com a beleza" },
      { id: "ne_porte", label: "Porte", type: "select", opts: [
        { value: "MEI", label: "Microempreendedor Individual (MEI)" },
        { value: "ME", label: "Microempresa (ME)" },
        { value: "EPP", label: "Empresa de Pequeno Porte (EPP)" },
      ]},
    ]
  },
  {
    title: "Capital Social",
    icon: "💰",
    fields: [
      { id: "cap_total", label: "Capital Total (R$)", type: "text", ph: "Ex: 10.000,00" },
      { id: "cap_total_extenso", label: "Capital por Extenso", type: "text", ph: "Ex: dez mil reais" },
      { id: "cap_num_quotas", label: "Nº de Quotas", type: "text", ph: "Ex: 10" },
      { id: "cap_num_quotas_extenso", label: "Nº Quotas por Extenso", type: "text", ph: "Ex: dez" },
      { id: "cap_valor_quota", label: "Valor por Quota (R$)", type: "text", ph: "Ex: 1.000,00" },
      { id: "cap_valor_quota_extenso", label: "Valor Quota por Extenso", type: "text", ph: "Ex: um mil reais" },
      { id: "cap_quotas_socio", label: "Quotas do Sócio", type: "text", ph: "Ex: 10" },
    ]
  },
  {
    title: "Administração e Vigência",
    icon: "⚙️",
    fields: [
      { id: "adm_nome", label: "Administrador(a)", type: "text", ph: "Nome completo do administrador" },
      { id: "vig_data_inicio", label: "Data Início Atividade", type: "text", ph: "Ex: 23/03/2017" },
      { id: "vig_foro", label: "Foro", type: "text", ph: "Ex: Belo Horizonte" },
      { id: "vig_local_data", label: "Local e Data da Assinatura", type: "text", ph: "Ex: Belo Horizonte, 24 de junho de 2025" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSES — CONTRATO SOCIAL CABELEIREIRO
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_CABELEIREIRO = [
  { icon: "🔄", label: "Transformação", id: "cc-transf" },
  { icon: "🏢", label: "Razão Social", id: "cc-1" },
  { icon: "💰", label: "Capital Social", id: "cc-2" },
  { icon: "📋", label: "Objeto Social", id: "cc-3" },
  { icon: "📊", label: "Porte", id: "cc-4" },
  { icon: "📑", label: "Consolidação", id: "cc-consol" },
  { icon: "🏢", label: "Nome e Sede", id: "cc-c1" },
  { icon: "📋", label: "Objeto (Consol.)", id: "cc-c2" },
  { icon: "💰", label: "Capital (Consol.)", id: "cc-c3" },
  { icon: "🔒", label: "Responsabilidade", id: "cc-c4" },
  { icon: "⚙️", label: "Administração", id: "cc-c5" },
  { icon: "📅", label: "Vigência e Porte", id: "cc-c6" },
  { icon: "🔄", label: "Cessão de Quotas", id: "cc-c7" },
  { icon: "🏪", label: "Filiais", id: "cc-c8" },
  { icon: "📅", label: "Exercício Social", id: "cc-c9" },
  { icon: "⚰️", label: "Falecimento", id: "cc-c10" },
  { icon: "🚫", label: "Exclusão de Sócio", id: "cc-c11" },
  { icon: "📜", label: "Declaração", id: "cc-c12" },
  { icon: "⚖️", label: "Foro", id: "cc-c13" },
];

/* ════════════════════════════════════════════
   DEFAULT DATA — ALTERAÇÃO CONTRATUAL INATIVIDADE
   ════════════════════════════════════════════ */
const DEFAULT_DATA_INATIVIDADE = {
  // Empresa
  emp_razao: "",
  emp_cnpj: "",
  emp_nire: "",
  emp_data_registro: "",
  emp_endereco: "",
  emp_cep: "",
  emp_objeto: "",
  emp_data_inicio_atividades: "",
  // Sócio
  sc_nome: "",
  sc_nacionalidade: "",
  sc_estado_civil: "",
  sc_profissao: "",
  sc_nascimento: "",
  sc_rg: "",
  sc_rg_orgao: "",
  sc_cpf: "",
  sc_endereco_residencial: "",
  sc_cep_residencial: "",
  // Capital Social
  cap_valor: "",
  cap_valor_extenso: "",
  cap_num_quotas: "",
  cap_num_quotas_extenso: "",
  cap_valor_quota: "",
  cap_valor_quota_extenso: "",
  // Alteração
  alt_numero: "1",
  // Inatividade
  inat_prazo_anos: "10",
  inat_data_inicio: "",
  // Assinatura
  vig_foro: "Belo Horizonte",
  vig_local_data: "",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — ALTERAÇÃO CONTRATUAL INATIVIDADE
   ════════════════════════════════════════════ */
const FIELD_GROUPS_INATIVIDADE = [
  {
    title: "Dados da Empresa",
    icon: "🏢",
    fields: [
      { id: "emp_razao", label: "Razão Social", type: "text", ph: "Ex: DAYSE ISABEL CRUZ SOARES LTDA" },
      { id: "emp_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "emp_nire", label: "NIRE", type: "text", ph: "Ex: 31215566632" },
      { id: "emp_data_registro", label: "Data Registro JUCEMG", type: "text", ph: "Ex: 11/09/2024" },
      { id: "emp_endereco", label: "Endereço Completo da Sede", type: "text", ph: "Rua, nº, bairro, cidade, UF" },
      { id: "emp_cep", label: "CEP da Sede", type: "text", ph: "00.000-000" },
      { id: "emp_objeto", label: "Objeto Social", type: "text", ph: "Atividades da empresa" },
      { id: "emp_data_inicio_atividades", label: "Data Início das Atividades", type: "text", ph: "Ex: 27/10/2014" },
    ]
  },
  {
    title: "Dados do(a) Sócio(a)",
    icon: "👤",
    fields: [
      { id: "sc_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) sócio(a)" },
      { id: "sc_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileira" },
      { id: "sc_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: divorciada" },
      { id: "sc_profissao", label: "Profissão", type: "text", ph: "Ex: empresária" },
      { id: "sc_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 22/01/1958" },
      { id: "sc_rg", label: "RG / Identidade", type: "text", ph: "Ex: MG 1.112.442" },
      { id: "sc_rg_orgao", label: "Órgão Emissor", type: "text", ph: "Ex: SSP-MG" },
      { id: "sc_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "sc_endereco_residencial", label: "Endereço Residencial Completo", type: "text", ph: "Av./Rua, nº, bairro, cidade, UF" },
      { id: "sc_cep_residencial", label: "CEP Residencial", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Capital Social",
    icon: "💰",
    fields: [
      { id: "cap_valor", label: "Valor Total (R$)", type: "text", ph: "Ex: 15.000,00" },
      { id: "cap_valor_extenso", label: "Valor por Extenso", type: "text", ph: "Ex: quinze mil reais" },
      { id: "cap_num_quotas", label: "Número de Quotas", type: "text", ph: "Ex: 15.000" },
      { id: "cap_num_quotas_extenso", label: "Quotas por Extenso", type: "text", ph: "Ex: quinze mil" },
      { id: "cap_valor_quota", label: "Valor de Cada Quota (R$)", type: "text", ph: "Ex: 1,00" },
      { id: "cap_valor_quota_extenso", label: "Valor da Quota por Extenso", type: "text", ph: "Ex: um Real" },
    ]
  },
  {
    title: "Inatividade e Assinatura",
    icon: "⏸️",
    fields: [
      { id: "alt_numero", label: "Nº da Alteração", type: "text", ph: "Ex: 1" },
      { id: "inat_prazo_anos", label: "Prazo Paralisação (anos)", type: "text", ph: "Ex: 10" },
      { id: "inat_data_inicio", label: "Data Início da Paralisação", type: "text", ph: "Ex: 16 de setembro de 2024" },
      { id: "vig_local_data", label: "Local e Data da Assinatura", type: "text", ph: "Ex: Belo Horizonte, 16 de setembro de 2024" },
      { id: "vig_foro", label: "Foro", type: "text", ph: "Belo Horizonte" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSE ITEMS — ALTERAÇÃO CONTRATUAL INATIVIDADE
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_INATIVIDADE = [
  { icon: "📋", label: "Alteração", id: "inat-alteracao" },
  { icon: "⏸️", label: "Paralisação", id: "inat-primeira" },
  { icon: "📜", label: "Consolidação", id: "inat-consolidacao" },
  { icon: "🏠", label: "Sede", id: "inat-clausula-1" },
  { icon: "🎯", label: "Objeto Social", id: "inat-clausula-2" },
  { icon: "💰", label: "Capital Social", id: "inat-clausula-3" },
  { icon: "🔒", label: "Responsabilidade", id: "inat-clausula-4" },
  { icon: "👤", label: "Administração", id: "inat-clausula-5" },
  { icon: "📅", label: "Atividades e Prazo", id: "inat-clausula-6" },
  { icon: "📄", label: "Cessão de Quotas", id: "inat-clausula-7" },
  { icon: "🏪", label: "Filiais", id: "inat-clausula-8" },
  { icon: "📊", label: "Exercício Social", id: "inat-clausula-9" },
  { icon: "⚰️", label: "Falecimento", id: "inat-clausula-10" },
  { icon: "❌", label: "Exclusão de Sócio", id: "inat-clausula-11" },
  { icon: "⚖️", label: "Declaração Legal", id: "inat-clausula-12" },
  { icon: "🏛️", label: "Foro", id: "inat-clausula-13" },
];

/* ════════════════════════════════════════════
   DEFAULT DATA — ALTERAÇÃO CONTRATUAL (CESSÃO DE QUOTAS)
   ════════════════════════════════════════════ */
const DEFAULT_DATA_ALTERACAO = {
  // Alteração
  alt_numero: "1",
  // Empresa
  emp_razao: "",
  emp_cnpj: "",
  emp_nire: "",
  emp_data_registro: "",
  emp_endereco: "",
  emp_cep: "",
  emp_nome_fantasia: "",
  emp_objeto: "",
  // Sócio 1
  sc1_nome: "",
  sc1_nacionalidade: "",
  sc1_estado_civil: "",
  sc1_profissao: "",
  sc1_nascimento: "",
  sc1_rg: "",
  sc1_rg_orgao: "",
  sc1_cpf: "",
  sc1_endereco: "",
  sc1_cep: "",
  // Sócio 2
  sc2_nome: "",
  sc2_nacionalidade: "",
  sc2_estado_civil: "",
  sc2_profissao: "",
  sc2_nascimento: "",
  sc2_rg: "",
  sc2_rg_orgao: "",
  sc2_cpf: "",
  sc2_endereco: "",
  sc2_cep: "",
  // Cessão de quotas
  ces_cedente: "",
  ces_percentual: "",
  ces_percentual_extenso: "",
  ces_cessionario: "",
  // Distribuição pós-alteração — Sócio 1
  dist_sc1_quotas: "",
  dist_sc1_quotas_extenso: "",
  dist_sc1_total: "",
  dist_sc1_total_extenso: "",
  dist_sc1_percentual: "",
  // Distribuição pós-alteração — Sócio 2
  dist_sc2_quotas: "",
  dist_sc2_quotas_extenso: "",
  dist_sc2_total: "",
  dist_sc2_total_extenso: "",
  dist_sc2_percentual: "",
  // Capital Social (consolidação)
  cap_valor: "",
  cap_valor_extenso: "",
  cap_num_quotas: "",
  cap_num_quotas_extenso: "",
  cap_valor_quota: "",
  cap_valor_quota_extenso: "",
  // Administração
  adm_nome: "",
  // Enquadramento
  enq_porte: "ME",
  // Assinatura
  vig_foro: "Belo Horizonte, estado de Minas Gerais",
  vig_local_data: "",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — ALTERAÇÃO CONTRATUAL
   ════════════════════════════════════════════ */
const FIELD_GROUPS_ALTERACAO = [
  {
    title: "Dados da Empresa",
    icon: "🏢",
    fields: [
      { id: "emp_razao", label: "Razão Social", type: "text", ph: "Ex: OUROFIT ACADEMIA LTDA" },
      { id: "emp_nome_fantasia", label: "Nome Fantasia", type: "text", ph: "Ex: ACADEMIA OUROFIT" },
      { id: "emp_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "emp_nire", label: "NIRE", type: "text", ph: "Ex: 31215077968" },
      { id: "emp_data_registro", label: "Data Registro JUCEMG", type: "text", ph: "Ex: 17/04/2024" },
      { id: "emp_endereco", label: "Endereço Completo da Sede", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "emp_cep", label: "CEP da Sede", type: "text", ph: "00.000-000" },
      { id: "emp_objeto", label: "Objeto Social", type: "text", ph: "Atividades da empresa" },
    ]
  },
  {
    title: "Sócio(a) 1",
    icon: "👤",
    fields: [
      { id: "sc1_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) sócio(a)" },
      { id: "sc1_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileiro" },
      { id: "sc1_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: divorciado" },
      { id: "sc1_profissao", label: "Profissão", type: "text", ph: "Ex: administrador" },
      { id: "sc1_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 03/07/1984" },
      { id: "sc1_rg", label: "RG / Identidade", type: "text", ph: "Ex: MG-12693744" },
      { id: "sc1_rg_orgao", label: "Órgão Emissor", type: "text", ph: "Ex: SSP/MG" },
      { id: "sc1_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "sc1_endereco", label: "Endereço Residencial Completo", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "sc1_cep", label: "CEP Residencial", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Sócio(a) 2",
    icon: "👤",
    fields: [
      { id: "sc2_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) sócio(a)" },
      { id: "sc2_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileira" },
      { id: "sc2_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: casada com comunhão parcial de bens" },
      { id: "sc2_profissao", label: "Profissão", type: "text", ph: "Ex: administradora" },
      { id: "sc2_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 23/02/2000" },
      { id: "sc2_rg", label: "RG / Identidade", type: "text", ph: "Ex: 17.863.945" },
      { id: "sc2_rg_orgao", label: "Órgão Emissor", type: "text", ph: "Ex: PC/MG" },
      { id: "sc2_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "sc2_endereco", label: "Endereço Residencial Completo", type: "text", ph: "Rua, nº, apto, bairro, cidade/UF" },
      { id: "sc2_cep", label: "CEP Residencial", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Cessão de Quotas (Cláusula da Alteração)",
    icon: "🔄",
    fields: [
      { id: "ces_cedente", label: "Quem cede as quotas", type: "text", ph: "Nome completo do cedente" },
      { id: "ces_percentual", label: "Percentual cedido", type: "text", ph: "Ex: 45%" },
      { id: "ces_percentual_extenso", label: "Percentual por extenso", type: "text", ph: "Ex: quarenta e cinco por cento" },
      { id: "ces_cessionario", label: "Quem recebe as quotas", type: "text", ph: "Nome completo do cessionário" },
    ]
  },
  {
    title: "Nova Distribuição — Sócio 1",
    icon: "📊",
    fields: [
      { id: "dist_sc1_quotas", label: "Nº de Quotas", type: "text", ph: "Ex: 95" },
      { id: "dist_sc1_quotas_extenso", label: "Quotas por Extenso", type: "text", ph: "Ex: noventa e cinco" },
      { id: "dist_sc1_total", label: "Valor Total (R$)", type: "text", ph: "Ex: 47.500,00" },
      { id: "dist_sc1_total_extenso", label: "Valor Total por Extenso", type: "text", ph: "Ex: quarenta e sete mil e quinhentos reais" },
      { id: "dist_sc1_percentual", label: "Percentual (%)", type: "text", ph: "Ex: 95" },
    ]
  },
  {
    title: "Nova Distribuição — Sócio 2",
    icon: "📊",
    fields: [
      { id: "dist_sc2_quotas", label: "Nº de Quotas", type: "text", ph: "Ex: 5" },
      { id: "dist_sc2_quotas_extenso", label: "Quotas por Extenso", type: "text", ph: "Ex: cinco" },
      { id: "dist_sc2_total", label: "Valor Total (R$)", type: "text", ph: "Ex: 2.500,00" },
      { id: "dist_sc2_total_extenso", label: "Valor Total por Extenso", type: "text", ph: "Ex: dois mil e quinhentos reais" },
      { id: "dist_sc2_percentual", label: "Percentual (%)", type: "text", ph: "Ex: 5" },
    ]
  },
  {
    title: "Capital Social (Consolidação)",
    icon: "💰",
    fields: [
      { id: "cap_valor", label: "Capital Total (R$)", type: "text", ph: "Ex: 50.000,00" },
      { id: "cap_valor_extenso", label: "Capital por Extenso", type: "text", ph: "Ex: cinquenta mil reais" },
      { id: "cap_num_quotas", label: "Total de Quotas", type: "text", ph: "Ex: 100" },
      { id: "cap_num_quotas_extenso", label: "Quotas por Extenso", type: "text", ph: "Ex: cem" },
      { id: "cap_valor_quota", label: "Valor de Cada Quota (R$)", type: "text", ph: "Ex: 500,00" },
      { id: "cap_valor_quota_extenso", label: "Valor da Quota por Extenso", type: "text", ph: "Ex: quinhentos reais" },
    ]
  },
  {
    title: "Administração e Enquadramento",
    icon: "⚙️",
    fields: [
      { id: "adm_nome", label: "Nome do Administrador", type: "text", ph: "Nome completo do administrador" },
      { id: "enq_porte", label: "Porte da Empresa", type: "select", opts: [
        { value: "ME", label: "Microempresa (ME)" },
        { value: "EPP", label: "Empresa de Pequeno Porte (EPP)" },
      ]},
    ]
  },
  {
    title: "Assinatura",
    icon: "📅",
    fields: [
      { id: "alt_numero", label: "Nº da Alteração", type: "text", ph: "Ex: 1" },
      { id: "vig_foro", label: "Foro", type: "text", ph: "Belo Horizonte, estado de Minas Gerais" },
      { id: "vig_local_data", label: "Local e Data", type: "text", ph: "Ex: Belo Horizonte, 28 de março de 2025" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSE ITEMS — ALTERAÇÃO CONTRATUAL
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_ALTERACAO = [
  { icon: "📋", label: "Alteração", id: "alt-cabecalho" },
  { icon: "🔄", label: "Cessão de Quotas", id: "alt-clausula-1" },
  { icon: "📜", label: "Consolidação", id: "alt-consolidacao" },
  { icon: "🏷️", label: "Nome e Prazo", id: "alt-cons-1" },
  { icon: "🏠", label: "Sede", id: "alt-cons-2" },
  { icon: "🎯", label: "Objeto Social", id: "alt-cons-3" },
  { icon: "💰", label: "Capital Social", id: "alt-cons-4" },
  { icon: "👤", label: "Administração", id: "alt-cons-5" },
  { icon: "📊", label: "Exercício Social", id: "alt-cons-6" },
  { icon: "🏪", label: "Filiais", id: "alt-cons-7" },
  { icon: "⚖️", label: "Declaração Sócios", id: "alt-cons-8" },
  { icon: "⚰️", label: "Dissolução", id: "alt-cons-9" },
  { icon: "🚪", label: "Retirada", id: "alt-cons-10" },
  { icon: "📄", label: "Cessão de Quotas", id: "alt-cons-11" },
  { icon: "⚖️", label: "Declaração Admin.", id: "alt-cons-12" },
  { icon: "📏", label: "Enquadramento", id: "alt-cons-13" },
  { icon: "🏛️", label: "Foro", id: "alt-cons-14" },
];

/* ════════════════════════════════════════════
   DEFAULT DATA — TERMO DE DISTRATO
   ════════════════════════════════════════════ */
const DEFAULT_DATA_DISTRATO = {
  // Contratante
  ct_razao: "",
  ct_cnpj: "",
  ct_endereco: "",
  ct_cep: "",
  // Contratada
  cd_razao: "",
  cd_cnpj: "",
  cd_endereco: "",
  cd_cep: "",
  // Contrato original
  orig_data_celebracao: "",
  orig_objeto: "a parceria entre salão parceiro e profissional parceiro",
  orig_lei: "Lei Federal nº 13.352 de 27 de outubro de 2016",
  orig_lei_nome: "Lei dos profissionais de Estética e Beleza – 13.352/16",
  // Distrato
  dist_data_encerramento: "",
  // Testemunhas
  test1_nome: "",
  test1_cpf: "",
  test2_nome: "",
  test2_cpf: "",
  // Assinatura
  vig_local_data: "",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — TERMO DE DISTRATO
   ════════════════════════════════════════════ */
const FIELD_GROUPS_DISTRATO = [
  {
    title: "Contratante",
    icon: "🏢",
    fields: [
      { id: "ct_razao", label: "Razão Social", type: "text", ph: "Ex: EMPRESA LTDA - ME" },
      { id: "ct_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "ct_endereco", label: "Endereço Completo", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "ct_cep", label: "CEP", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Contratada",
    icon: "👤",
    fields: [
      { id: "cd_razao", label: "Razão Social / Nome", type: "text", ph: "Ex: NOME DO PROFISSIONAL" },
      { id: "cd_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "cd_endereco", label: "Endereço Completo", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "cd_cep", label: "CEP", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Dados do Contrato Original",
    icon: "📋",
    fields: [
      { id: "orig_data_celebracao", label: "Data de Celebração do Contrato", type: "text", ph: "Ex: 1º de fevereiro de 2021" },
      { id: "orig_objeto", label: "Objeto do Contrato", type: "text", ph: "Ex: a parceria entre salão parceiro e profissional parceiro" },
      { id: "orig_lei", label: "Lei de Referência", type: "text", ph: "Ex: Lei Federal nº 13.352 de 27 de outubro de 2016" },
      { id: "orig_lei_nome", label: "Nome da Lei", type: "text", ph: "Ex: Lei dos profissionais de Estética e Beleza – 13.352/16" },
    ]
  },
  {
    title: "Distrato",
    icon: "📝",
    fields: [
      { id: "dist_data_encerramento", label: "Data de Encerramento", type: "text", ph: "Ex: 13 de abril de 2021" },
    ]
  },
  {
    title: "Testemunhas",
    icon: "👥",
    fields: [
      { id: "test1_nome", label: "Testemunha 1 — Nome", type: "text", ph: "Nome completo" },
      { id: "test1_cpf", label: "Testemunha 1 — CPF", type: "text", ph: "000.000.000-00" },
      { id: "test2_nome", label: "Testemunha 2 — Nome", type: "text", ph: "Nome completo" },
      { id: "test2_cpf", label: "Testemunha 2 — CPF", type: "text", ph: "000.000.000-00" },
    ]
  },
  {
    title: "Assinatura",
    icon: "📅",
    fields: [
      { id: "vig_local_data", label: "Local e Data", type: "text", ph: "Ex: Belo Horizonte, 13 de abril de 2022" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSE ITEMS — TERMO DE DISTRATO
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_DISTRATO = [
  { icon: "👥", label: "Das Partes", id: "dist-partes" },
  { icon: "📋", label: "Considerando", id: "dist-considerando" },
  { icon: "📝", label: "Resolvem", id: "dist-resolvem" },
  { icon: "⚖️", label: "Declaração", id: "dist-declaram" },
  { icon: "✍️", label: "Assinaturas", id: "dist-assinaturas" },
];

/* ════════════════════════════════════════════
   DEFAULT DATA — COMUNICAÇÃO DE PARALISAÇÃO
   ════════════════════════════════════════════ */
const DEFAULT_DATA_PARALISACAO = {
  // Empresa
  emp_razao: "",
  emp_endereco: "",
  emp_cep: "",
  emp_nire: "",
  emp_data_registro: "",
  emp_cnpj: "",
  emp_objeto: "",
  emp_data_inicio_atividades: "",
  // Paralisação
  par_prazo_anos: "10",
  par_prazo_extenso: "dez",
  par_data_inicio: "",
  // Capital
  cap_valor: "",
  cap_valor_extenso: "",
  cap_num_quotas: "",
  cap_num_quotas_extenso: "",
  cap_valor_quota: "",
  cap_valor_quota_extenso: "",
  // Administração
  adm_nome: "",
  // Filial (opcional)
  fil_endereco: "",
  fil_cep: "",
  fil_nire: "",
  fil_data_registro: "",
  // Sócio
  sc_nome: "",
  sc_nacionalidade: "",
  sc_estado_civil: "",
  sc_profissao: "",
  sc_nascimento: "",
  sc_rg: "",
  sc_rg_orgao: "",
  sc_cpf: "",
  sc_endereco: "",
  sc_cep: "",
  sc_quotas: "",
  sc_quotas_extenso: "",
  // Assinatura
  vig_local_data: "",
};

/* ════════════════════════════════════════════
   FIELD DEFINITIONS — COMUNICAÇÃO DE PARALISAÇÃO
   ════════════════════════════════════════════ */
const FIELD_GROUPS_PARALISACAO = [
  {
    title: "Dados da Empresa",
    icon: "🏢",
    fields: [
      { id: "emp_razao", label: "Razão Social", type: "text", ph: "Ex: DAYSE ISABEL CRUZ SOARES LTDA" },
      { id: "emp_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "emp_nire", label: "NIRE", type: "text", ph: "Ex: 31215566632" },
      { id: "emp_data_registro", label: "Data Registro JUCEMG", type: "text", ph: "Ex: 11/09/2024" },
      { id: "emp_endereco", label: "Endereço Completo da Sede", type: "text", ph: "Rua, nº, bairro, cidade-UF" },
      { id: "emp_cep", label: "CEP da Sede", type: "text", ph: "00.000-000" },
      { id: "emp_objeto", label: "Objeto Social", type: "text", ph: "Atividades da empresa" },
      { id: "emp_data_inicio_atividades", label: "Data Início das Atividades", type: "text", ph: "Ex: 28/10/2014" },
    ]
  },
  {
    title: "Paralisação",
    icon: "⏸️",
    fields: [
      { id: "par_prazo_anos", label: "Prazo (anos)", type: "text", ph: "Ex: 10" },
      { id: "par_prazo_extenso", label: "Prazo por Extenso", type: "text", ph: "Ex: dez" },
      { id: "par_data_inicio", label: "Data Início da Paralisação", type: "text", ph: "Ex: 16/09/2024" },
    ]
  },
  {
    title: "Capital Social",
    icon: "💰",
    fields: [
      { id: "cap_valor", label: "Valor Total (R$)", type: "text", ph: "Ex: 15.000,00" },
      { id: "cap_valor_extenso", label: "Valor por Extenso", type: "text", ph: "Ex: quinze mil reais" },
      { id: "cap_num_quotas", label: "Número de Quotas", type: "text", ph: "Ex: 15.000" },
      { id: "cap_num_quotas_extenso", label: "Quotas por Extenso", type: "text", ph: "Ex: quinze mil" },
      { id: "cap_valor_quota", label: "Valor de Cada Quota (R$)", type: "text", ph: "Ex: 1,00" },
      { id: "cap_valor_quota_extenso", label: "Valor da Quota por Extenso", type: "text", ph: "Ex: um real" },
    ]
  },
  {
    title: "Administração",
    icon: "⚙️",
    fields: [
      { id: "adm_nome", label: "Nome do(a) Administrador(a)", type: "text", ph: "Nome completo" },
    ]
  },
  {
    title: "Filial (opcional)",
    icon: "🏪",
    fields: [
      { id: "fil_endereco", label: "Endereço da Filial", type: "text", ph: "Rua, nº, bairro, cidade/UF (deixe vazio se não houver)", hint: "Opcional — deixe em branco se a empresa não tiver filial. A seção só aparecerá no contrato se este campo for preenchido." },
      { id: "fil_cep", label: "CEP da Filial", type: "text", ph: "00.000-000" },
      { id: "fil_nire", label: "NIRE da Filial", type: "text", ph: "Ex: 33901366975" },
      { id: "fil_data_registro", label: "Data Registro da Filial", type: "text", ph: "Ex: 26/11/2015" },
    ]
  },
  {
    title: "Dados do(a) Sócio(a)",
    icon: "👤",
    fields: [
      { id: "sc_nome", label: "Nome Completo", type: "text", ph: "Nome do(a) sócio(a)" },
      { id: "sc_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileira" },
      { id: "sc_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: divorciada" },
      { id: "sc_profissao", label: "Profissão", type: "text", ph: "Ex: empresária" },
      { id: "sc_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 22/01/1958" },
      { id: "sc_rg", label: "RG / Identidade", type: "text", ph: "Ex: MG 1.112.442" },
      { id: "sc_rg_orgao", label: "Órgão Emissor", type: "text", ph: "Ex: SSP-MG" },
      { id: "sc_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "sc_endereco", label: "Endereço Residencial Completo", type: "text", ph: "Av./Rua, nº, bairro, cidade, UF" },
      { id: "sc_cep", label: "CEP Residencial", type: "text", ph: "00.000-000" },
      { id: "sc_quotas", label: "Nº de Quotas", type: "text", ph: "Ex: 15.000" },
      { id: "sc_quotas_extenso", label: "Quotas por Extenso", type: "text", ph: "Ex: quinze mil" },
    ]
  },
  {
    title: "Assinatura",
    icon: "📅",
    fields: [
      { id: "vig_local_data", label: "Local e Data", type: "text", ph: "Ex: Belo Horizonte, 16/09/2024" },
    ]
  },
];

/* ════════════════════════════════════════════
   SIDEBAR CLAUSE ITEMS — COMUNICAÇÃO DE PARALISAÇÃO
   ════════════════════════════════════════════ */
const CLAUSE_ITEMS_PARALISACAO = [
  { icon: "📋", label: "Comunicação", id: "par-comunicacao" },
  { icon: "🎯", label: "Objeto Social", id: "par-objeto" },
  { icon: "💰", label: "Capital Social", id: "par-capital" },
  { icon: "👤", label: "Administração", id: "par-admin" },
  { icon: "📅", label: "Prazo e Atividades", id: "par-prazo" },
  { icon: "🏪", label: "Filial", id: "par-filial" },
  { icon: "👥", label: "Dados do Sócio", id: "par-socio" },
  { icon: "✍️", label: "Assinatura", id: "par-assinatura" },
];

/* ════════════════════════════════════════════
   DEFAULT CONTRACT DATA — ALTERAÇÃO CONTRATUAL ESSENCIAL CONTABILIDADE
   ════════════════════════════════════════════ */
const DEFAULT_DATA_ALTERACAOESSENCIAL = {
  // Empresa (antes da transformação)
  emp_razao_anterior: "ANA LUCIA GONÇALVES - ME",
  emp_cnpj: "11.154.925/0001-03",
  emp_nire: "31109925543",
  emp_data_registro: "17/09/2009",
  emp_crc: "MG-012.577O",
  emp_endereco: "rua Anunciação, nº 218. bairro Jardim São José, BH/MG",
  emp_cep: "30.820-160",
  // Sócia
  sc_nome: "Ana Lúcia Gonçalves",
  sc_nacionalidade: "brasileira",
  sc_estado_civil: "divorciada",
  sc_profissao: "Técnico em Contabilidade",
  sc_nascimento: "19/07/1969",
  sc_naturalidade: "Pará de Minas /MG",
  sc_rg: "5.021.848",
  sc_rg_orgao: "SSP/MG",
  sc_cpf: "762.792.436-72",
  sc_crc: "MG-053.455/O",
  sc_endereco: "rua Anunciação, nº 218. bairro Jardim São José, BH/MG",
  sc_endereco_atos: "rua Anunciação, nº 2018. bairro Jardim São José, BH/MG",
  sc_cep: "30.820-160",
  // Alteração arquivada
  alt_numero: "5157163",
  alt_data: "02/10/2013",
  // Nova empresa
  emp_razao_nova: "CONTABILIDADE ESSENCIAL LTDA",
  emp_nome_fantasia: "ESSENCIAL CONTABILIDADE",
  // Objeto social
  emp_objeto: "a prestação de serviços de atividade de contabilidade, como abertura, alteração contratual e baixa de empresas, bem como a contabilização dos setores fiscal, contabil, trabalhista e previdenciario. Execução das obrigações acessorias no âmbito federal, estadual e municipal",
  // Capital social
  cap_valor: "20.000,00",
  cap_valor_extenso: "Vinte mil reais",
  cap_valor_quota: "1.000,00",
  cap_valor_quota_extenso: "um mil real",
  // Início atividades
  emp_data_inicio: "17/09/2009",
  // Assinatura
  vig_local_data: "Belo Horizonte, 24 de Outubro de 2023",
  // Atos Constitutivos — Preâmbulo
  atos_preambulo: "CONTABILIDADE ESSENCIAL LTDA, sociedade empresaria limitada, inscrita no CNPJ sob nº 11.154.925/0001-03, registro no Conselho Regional de Contabilidade sob o nº MG-012.577/O, estabelecida à rua Anunciação, nº 218. bairro Jardim São José, BH/MG, CEP 30.820-160, representada pela única sócia, Ana Lúcia Gonçalves, brasileira, divorciada, Técnico em Contabilidade, nascida em 19/07/1969, natural de Pará de Minas /MG, portadora da Cédula de Identidade RG/MG n° 5.021.848, SSP/MG, inscrita no CPF sob n° 762.792.436-72, inscrita no Conselho Regional de Contabilidade sob nº MG-053.455/O, residente à rua Anunciação, nº 2018. bairro Jardim São José, BH/MG,CEP 30.820-160, registrada na Junta Comercial de Minas Gerais sob o NIRE nº 31109925543 em 17/09/2009 e alteração arquivada sob nº 5157163 em 02/10/2013, regida por este Contrato Social, pelas disposições legais aplicáveis às sociedades limitadas na Lei Federal 10.406 de 10 de janeiro de 2002, conforme cláusulas a seguir:",
  // Atos Constitutivos — Cap. I: Denominação, Sede, Objeto e Duração
  atos_cl1: "A sociedade empresaria limitada, rege sob a razão social de CONTABILIDADE ESSENCIAL LTDA e nome fantasia, ESSENCIAL CONTABILIDADE.",
  atos_cl2: "A Sociedade tem sede e foro à rua Anunciação, nº 218, bairro Jardim São José, BH/MG, CEP. 30820-160 e poderá abrir e encerrar filiais, em qualquer localidade do País.",
  atos_cl3: "O objeto social é a prestação de serviços de atividade de contabilidade, como abertura, alteração contratual e baixa de empresas, bem como a contabilização dos setores fiscal, contabil, trabalhista e previdenciario. Execução das obrigações acessorias no âmbito federal, estadual e municipal.",
  atos_cl4: "A Sociedade iniciou suas atividades em 17/09/2009 e terá prazo de duração indeterminado.",
  // Atos Constitutivos — Cap. II: Capital Social
  atos_cl5: "O capital social da Sociedade é de R$ R$20.000,00 (Vinte mil reais), no valor nominal de R$ 1.000,00 (um mil real) cada uma, totalmente subscrito e integralizado em moeda corrente nacional pelo único sócio.",
  atos_cl6: "A Sociedade é uma sociedade empresaria limitada nos termos do parágrafo primeiro do Art. 1.052 do Código Civil.",
  // Atos Constitutivos — Cap. III: Administração e Declaração do Sócio
  atos_cl7: "A administração da Sociedade será exercida pelo única sócia Ana Lúcia Gonçalves, ja qualificada acima, quem incumbe a representação ativa e passiva da Sociedade, judicial ou extrajudicialmente, e podendo praticar todos os atos compreendidos no objeto social, sempre no interesse da Sociedade, sendo vedado, todavia, a vinculação do patrimônio social em negócios estranhos à atividade da Sociedade, em especial configurar como avalista, realizar endossos e/ou depositar valores a título de caução.",
  atos_cl8: "A sócia, declara, sob as penas da lei, inclusive, que são verídicas todas as informações prestadas neste Contrato Social, e quanto ao disposto no Art. 299 do Código Penal, não estar impedido de exercer atividade empresária e não possuir outro registro como Empresário Individual no País.",
  atos_cl9: "As procurações da sociedade serão outorgadas pela única sócia e administradora devendo sempre especificar os poderes conferidos e, com exceção daquelas outorgadas para fins judiciais, terão prazo de validade limitado em 1 (um) ano.",
  atos_cl10: "A administradora da sociedade declara, sob as penas da lei, que não está impedido de exercer a administração da Sociedade, por lei especial, ou em virtude de condenação criminal, ou por se encontrar sob os efeitos dela, a pena que vede, ainda que temporariamente, o acesso a cargos públicos; ou por crime falimentar, de prevaricação, peita ou suborno, concussão, peculato, ou contra a economia popular, contra o sistema financeiro nacional, contra normas de defesa da concorrência, contra as relações de consumo, fé pública, ou a propriedade.",
  // Atos Constitutivos — Cap. IV: Deliberações Sociais
  atos_cl11: "As deliberações sociais serão tomadas sempre pela sua única sócia.",
  atos_cl12: "Dispensam-se as formalidades de convocação por ser constituída por única sócia.",
  atos_cl13: "Dos trabalhos e deliberações será lavrada ata que deverá ser assinada pelo sua única sócia.",
  // Atos Constitutivos — Cap. V: Exercício Social, Balanço e Lucros
  atos_cl14: "O exercício social se encerra no dia 31 de dezembro de cada ano, data em que serão levantadas as demonstrações financeiras do exercício, com observância das prescrições legais. A Sociedade distribuirá seus lucros, se houver, mediante aprovação de sua única sócia.",
  // Atos Constitutivos — Cap. VI: Continuidade da Sociedade
  atos_cl15: "No caso de falecimento ou interdição da única sócia, a empresa poderá continuar as suas atividades com os herdeiros, sucessores e/ou sucessores do incapaz. Na hipótese de não ser possível ou na ausência de interesse destes, os valores pendentes devem ser apurados e liquidados com base na situação patrimonial da empresa, à data da resolução, verificada em balanço especialmente levantado.",
  // Atos Constitutivos — Cap. VII: Foro
  atos_cl16: "Em caso de desavenças em razão deste Contrato Social, é estabelecido o foro da Comarca de Belo Horizonte para conhecer e dirimir quaisquer dúvidas ou discussões oriundas deste Contrato, com renúncia a qualquer outro, por mais especial e privilegiado que seja.",
};

const FIELD_GROUPS_ALTERACAOESSENCIAL = [
  {
    title: "Empresa (antes da transformação)",
    icon: "🏢",
    fields: [
      { id: "emp_razao_anterior", label: "Razão Social Anterior", type: "text", ph: "Ex: ANA LUCIA GONÇALVES - ME" },
      { id: "emp_cnpj", label: "CNPJ", type: "text", ph: "00.000.000/0000-00" },
      { id: "emp_nire", label: "NIRE", type: "text", ph: "Ex: 31109925543" },
      { id: "emp_data_registro", label: "Data de Registro", type: "text", ph: "Ex: 17/09/2009" },
      { id: "emp_crc", label: "CRC da Empresa", type: "text", ph: "Ex: MG-012.577O" },
      { id: "emp_endereco", label: "Endereço Completo", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "emp_cep", label: "CEP", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Dados da Sócia",
    icon: "👤",
    fields: [
      { id: "sc_nome", label: "Nome Completo", type: "text", ph: "Nome da sócia" },
      { id: "sc_nacionalidade", label: "Nacionalidade", type: "text", ph: "Ex: brasileira" },
      { id: "sc_estado_civil", label: "Estado Civil", type: "text", ph: "Ex: divorciada" },
      { id: "sc_profissao", label: "Profissão", type: "text", ph: "Ex: Técnico em Contabilidade" },
      { id: "sc_nascimento", label: "Data de Nascimento", type: "text", ph: "Ex: 19/07/1969" },
      { id: "sc_naturalidade", label: "Naturalidade", type: "text", ph: "Ex: Pará de Minas /MG" },
      { id: "sc_rg", label: "RG / Identidade", type: "text", ph: "Ex: 5.021.848" },
      { id: "sc_rg_orgao", label: "Órgão Emissor", type: "text", ph: "Ex: SSP/MG" },
      { id: "sc_cpf", label: "CPF", type: "text", ph: "000.000.000-00" },
      { id: "sc_crc", label: "CRC Pessoal", type: "text", ph: "Ex: MG-053.455/O" },
      { id: "sc_endereco", label: "Endereço (Transformação)", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "sc_endereco_atos", label: "Endereço (Atos Constitutivos)", type: "text", ph: "Rua, nº, bairro, cidade/UF" },
      { id: "sc_cep", label: "CEP", type: "text", ph: "00.000-000" },
    ]
  },
  {
    title: "Alteração Arquivada",
    icon: "📋",
    fields: [
      { id: "alt_numero", label: "Número da Alteração", type: "text", ph: "Ex: 5157163" },
      { id: "alt_data", label: "Data da Alteração", type: "text", ph: "Ex: 02/10/2013" },
    ]
  },
  {
    title: "Nova Empresa",
    icon: "🔄",
    fields: [
      { id: "emp_razao_nova", label: "Nova Razão Social", type: "text", ph: "Ex: CONTABILIDADE ESSENCIAL LTDA" },
      { id: "emp_nome_fantasia", label: "Nome Fantasia", type: "text", ph: "Ex: ESSENCIAL CONTABILIDADE" },
      { id: "emp_objeto", label: "Objeto Social", type: "textarea", ph: "Descrição das atividades" },
    ]
  },
  {
    title: "Capital Social",
    icon: "💰",
    fields: [
      { id: "cap_valor", label: "Valor Total (R$)", type: "text", ph: "Ex: 20.000,00" },
      { id: "cap_valor_extenso", label: "Valor por Extenso", type: "text", ph: "Ex: Vinte mil reais" },
      { id: "cap_valor_quota", label: "Valor de Cada Quota (R$)", type: "text", ph: "Ex: 1.000,00" },
      { id: "cap_valor_quota_extenso", label: "Valor da Quota por Extenso", type: "text", ph: "Ex: um mil real" },
    ]
  },
  {
    title: "Assinatura",
    icon: "📅",
    fields: [
      { id: "emp_data_inicio", label: "Início das Atividades", type: "text", ph: "Ex: 17/09/2009" },
      { id: "vig_local_data", label: "Local e Data", type: "text", ph: "Ex: Belo Horizonte, 24 de Outubro de 2023" },
    ]
  },
  {
    title: "Atos Constitutivos — Preâmbulo",
    icon: "📜",
    fields: [
      { id: "atos_preambulo", label: "Texto do Preâmbulo", type: "textarea", ph: "Texto introdutório dos atos constitutivos" },
    ]
  },
  {
    title: "Atos — Cap. I: Denominação, Sede, Objeto e Duração",
    icon: "🏛️",
    fields: [
      { id: "atos_cl1", label: "Cláusula 1 — Razão Social", type: "textarea", ph: "Texto da cláusula 1" },
      { id: "atos_cl2", label: "Cláusula 2 — Sede e Foro", type: "textarea", ph: "Texto da cláusula 2" },
      { id: "atos_cl3", label: "Cláusula 3 — Objeto Social", type: "textarea", ph: "Texto da cláusula 3" },
      { id: "atos_cl4", label: "Cláusula 4 — Início e Duração", type: "textarea", ph: "Texto da cláusula 4" },
    ]
  },
  {
    title: "Atos — Cap. II: Capital Social",
    icon: "💰",
    fields: [
      { id: "atos_cl5", label: "Cláusula 5 — Capital Social", type: "textarea", ph: "Texto da cláusula 5" },
      { id: "atos_cl6", label: "Cláusula 6 — Tipo Societário", type: "textarea", ph: "Texto da cláusula 6" },
    ]
  },
  {
    title: "Atos — Cap. III: Administração",
    icon: "⚙️",
    fields: [
      { id: "atos_cl7", label: "Cláusula 7 — Administração", type: "textarea", ph: "Texto da cláusula 7" },
      { id: "atos_cl8", label: "Cláusula 8 — Declaração da Sócia", type: "textarea", ph: "Texto da cláusula 8" },
      { id: "atos_cl9", label: "Cláusula 9 — Procurações", type: "textarea", ph: "Texto da cláusula 9" },
      { id: "atos_cl10", label: "Cláusula 10 — Impedimentos", type: "textarea", ph: "Texto da cláusula 10" },
    ]
  },
  {
    title: "Atos — Cap. IV: Deliberações Sociais",
    icon: "📋",
    fields: [
      { id: "atos_cl11", label: "Cláusula 11 — Deliberações", type: "textarea", ph: "Texto da cláusula 11" },
      { id: "atos_cl12", label: "Cláusula 12 — Convocação", type: "textarea", ph: "Texto da cláusula 12" },
      { id: "atos_cl13", label: "Cláusula 13 — Ata", type: "textarea", ph: "Texto da cláusula 13" },
    ]
  },
  {
    title: "Atos — Cap. V: Exercício Social",
    icon: "📊",
    fields: [
      { id: "atos_cl14", label: "Cláusula 14 — Exercício e Lucros", type: "textarea", ph: "Texto da cláusula 14" },
    ]
  },
  {
    title: "Atos — Cap. VI: Continuidade",
    icon: "🔗",
    fields: [
      { id: "atos_cl15", label: "Cláusula 15 — Continuidade", type: "textarea", ph: "Texto da cláusula 15" },
    ]
  },
  {
    title: "Atos — Cap. VII: Foro",
    icon: "⚖️",
    fields: [
      { id: "atos_cl16", label: "Cláusula 16 — Foro", type: "textarea", ph: "Texto da cláusula 16" },
    ]
  },
];

const CLAUSE_ITEMS_ALTERACAOESSENCIAL = [
  { icon: "🔄", label: "Transformação", id: "ae-transformacao" },
  { icon: "🏢", label: "Denominação e Sede", id: "ae-denominacao" },
  { icon: "🎯", label: "Objeto Social (Transf.)", id: "ae-objeto-transf" },
  { icon: "📜", label: "Atos Constitutivos", id: "ae-atos" },
  { icon: "🏛️", label: "Denominação e Duração", id: "ae-denominacao-atos" },
  { icon: "💰", label: "Capital Social", id: "ae-capital" },
  { icon: "⚙️", label: "Administração", id: "ae-admin" },
  { icon: "📋", label: "Deliberações Sociais", id: "ae-deliberacoes" },
  { icon: "📊", label: "Exercício e Balanço", id: "ae-exercicio" },
  { icon: "🔗", label: "Continuidade", id: "ae-continuidade" },
  { icon: "⚖️", label: "Foro", id: "ae-foro" },
  { icon: "✍️", label: "Assinatura", id: "ae-assinatura" },
];

/* ════════════════════════════════════════════
   CONTRACT TYPES (tabs)
   ════════════════════════════════════════════ */
const CONTRACT_TYPES = [
  { id: "prestacao", label: "Prestação de Serviços Contábeis", icon: "📊" },
  { id: "parceria", label: "Parceria Salão (Lei 13.352/16)", icon: "💇" },
  { id: "social", label: "Contrato Social", icon: "🏢" },
  { id: "cabeleireiro", label: "Contrato Social Cabeleireiro", icon: "✂️" },
  { id: "inatividade", label: "Alteração Contratual Inatividade", icon: "⏸️" },
  { id: "alteracao", label: "Alteração Contratual", icon: "🔄" },
  { id: "distrato", label: "Termo de Distrato", icon: "📝" },
  { id: "paralisacao", label: "Comunicação de Paralisação", icon: "🔇" },
  { id: "alteracaoessencial", label: "Alteração Contratual Essencial", icon: "🏛️" },
];

/* ════════════════════════════════════════════
   EXPORT UTILITIES
   ════════════════════════════════════════════ */
function buildContractHTML(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const bold = (text) => `<b>${text}</b>`;

  return `
<h1 style="font-size:14pt;text-align:center;margin-bottom:20pt;letter-spacing:0.5pt;font-weight:700;">INSTRUMENTO PARTICULAR DE CONTRATO DE PRESTAÇÃO DE SERVIÇOS PROFISSIONAIS CONTÁBEIS</h1>

${p(`${bold("CONTRATADO")} - ${bold(d.cd_razao)}, nome fantasia: ${bold(d.cd_fantasia)}, com sede na ${d.cd_endereco}, CEP: ${d.cd_cep}, inscrito CNPJ n.°${d.cd_cnpj}, registrado no CRC/MG sob o nº ${d.cd_crc}, neste ato representada por sua sócia administrativa, ${bold(d.cd_socia_nome)}, ${d.cd_socia_nacionalidade}, ${d.cd_socia_profissao}, ${d.cd_socia_estado_civil}, portadora do nº CPF n.º ${d.cd_socia_cpf}.`)}

${p(`${bold("CONTRATANTE")} - ${bold(d.ct_razao || "________")}, inscrita no CNPJ sob o nº ${d.ct_cnpj || "________"}, com sede na ${d.ct_endereco || "________"}, CEP: ${d.ct_cep || "________"}, neste ato representada por seu sócio ${bold(d.ct_socio_nome || "________")}, ${d.ct_socio_nacionalidade || "________"}, ${d.ct_socio_profissao || "________"}, ${d.ct_socio_estado_civil || "________"}, portador do CPF n.º ${d.ct_socio_cpf || "________"}.`)}

${p(`Pelo presente instrumento particular, as partes acima, devidamente qualificadas, doravante denominadas simplesmente, ${bold("CONTRATADA")} e ${bold("CONTRATANTE")}, na melhor forma de direito, ajustam e contratam a prestação de serviços profissionais, segundo as cláusulas e condições adiante arroladas.`)}

${sec("CLÁUSULA PRIMEIRA — DO OBJETO")}
${p("O objeto do presente consiste na prestação pela CONTRATADA à CONTRATANTE dos seguintes serviços profissionais, no qual compreende:")}

${sec("CLÁUSULA SEGUNDA — ÁREAS DE SERVIÇO")}
${p("O profissional contratado obriga-se a prestar seus serviços profissionais ao CONTRATANTE, nas seguintes áreas:")}

${p(`${bold("1. CONTABILIDADE")}`)}
${p("1.1. Elaboração da Contabilidade de acordo com as Normas Brasileiras de Contabilidade.")}
${p("1.2. Emissão de balancetes.")}
${p("1.3. Elaboração de Balanço Patrimonial e demais Demonstrações Contábeis obrigatórias.")}

${p(`${bold("2. OBRIGAÇÕES FISCAIS")}`)}
${p("2.1. Orientação e controle de aplicação dos dispositivos legais vigentes, sejam federais, estaduais ou municipais.")}
${p("2.2. Elaboração dos registros fiscais obrigatórios, eletrônicos ou não, perante os órgãos municipais, estaduais e federais, bem como as demais obrigações que se fizerem necessárias.")}
${p("2.3. Atendimento às demais exigências previstas na legislação, bem como aos eventuais procedimentos fiscais.")}

${sec("CLÁUSULA TERCEIRA — DA RESPONSABILIDADE TÉCNICA")}
${p("O CONTRATADO assume inteira responsabilidade pelos serviços técnicos a que se obrigou, assim como pelas orientações que prestar.")}

${sec("CLÁUSULA QUARTA — DA DOCUMENTAÇÃO")}
${p(`O CONTRATANTE se obriga a separar mensalmente a documentação que deverá ser enviada de forma completa e em boa ordem através dos seguintes endereços de e-mail nos seguintes prazos:`)}
${p(`Até ${d.prazo_folha} dias após o encerramento do mês, para envio dos eventos para folha de pagamento: A/C Fernanda Pontes – Departamento Pessoal: <u>${d.email_pessoal}</u> sempre com cópia para <u>${d.email_contabil}</u>; e até ${d.prazo_docs} dias após o encerramento do mês para o envio de arquivos XML de notas de vendas e compras, extrato bancário em arquivo PDF e OFX, e a documentação física das despesas mensais: A/C ${d.cd_socia_nome} - Setor Contábil e Fiscal: <u>${d.email_contabil}</u>, a fim de que a CONTRATADA possa executar seus serviços na conformidade com o citado neste instrumento.`)}
${p(`${bold("PARÁGRAFO PRIMEIRO")} - Responsabilizar-se-á o CONTRATADO por todos os documentos a ele entregue pelo CONTRATANTE, enquanto permanecerem sob sua guarda para a consecução dos serviços pactuados, salvo comprovados casos fortuitos e motivos de força maior.`)}
${p(`${bold("PARÁGRAFO SEGUNDO")} - O CONTRATANTE tem ciência da Lei 9.613/98, alterada pela Lei 12.683/2012, especificamente no que trata da lavagem de dinheiro, regulamentada pela Resolução CFC n.º 1.345/13 do Conselho Federal de Contabilidade.`)}

${sec("CLÁUSULA QUINTA — DAS ORIENTAÇÕES")}
${p("As orientações dadas pelo CONTRATADO deverão ser seguidas pela contratante, eximindo-se o primeiro das consequências da não observância do seu cumprimento.")}

${sec("CLÁUSULA SEXTA — DAS OBRIGAÇÕES DO CONTRATADO")}
${p("O CONTRATADO se obriga a entregar ao contratante, mediante protocolo, com tempo hábil, os documentos necessários para que este efetue os devidos pagamentos e recolhimentos obrigatórios, bem como comprovante de entrega das obrigações acessórias.")}
${p(`${bold("PARÁGRAFO ÚNICO")} - As multas decorrentes da entrega fora do prazo contratado das obrigações previstas no <i>caput</i> deste artigo, ou que forem decorrentes da imperfeição ou inexecução dos serviços por parte do CONTRATADO, serão de sua responsabilidade.`)}

${sec("CLÁUSULA SÉTIMA — DOS HONORÁRIOS")}
${p(`O CONTRATANTE pagará ao contratado pelos serviços prestados, os honorários mensais de R$ ${d.fin_honorarios || "________"} (${d.fin_honorarios_extenso || "________"}), com vencimento a partir do dia ${bold(d.fin_vencimento || "________")}.`)}
${p(`${bold("PARÁGRAFO PRIMEIRO")} - Os honorários serão reajustados anualmente de acordo com o reajuste do salário-mínimo vigente no país e/ou em comum acordo entre as partes ou quando houver aumento dos serviços contratados.`)}
${p(`${bold("PARÁGRAFO SEGUNDO")} - O valor deste honorário será fixado anualmente pela CONTRATADA, podendo variar conforme a elevação do faturamento, volume de documentos, complexidade das operações e alteração do regime tributário da contratante, mediante comunicação prévia.`)}

${sec("CLÁUSULA OITAVA — DO 13º HONORÁRIO")}
${p("No mês de dezembro de cada ano, será cobrado o equivalente a 01 (um) honorário mensal, a ser pago até o dia 10 daquele mês por conta do Encerramento do Balanço Patrimonial e demais obrigações anuais.")}

${sec("CLÁUSULA NONA — DA MANUTENÇÃO MENSAL")}
${p("Os honorários contábeis serão cobrados mensalmente independente da empresa estar em atividade ou não, independente da empresa estar emitindo nota fiscal ou não, pela consultoria contábil a disposição do cliente bem como a manutenção contábil mensal da empresa em questão.")}

${sec("CLÁUSULA DÉCIMA — SEGREGAÇÃO DE RECEITAS E APLICAÇÃO DE ALÍQUOTAS NO REGIME DE LUCRO PRESUMIDO (EQUIPARAÇÃO HOSPITALAR)")}
${p("A CONTRATANTE declara estar ciente de que poderá usufruir do benefício fiscal de <b>Equiparação Hospitalar</b>, nos termos do art. 15, §1º, inciso III, alínea \"a\", da Lei nº 9.249/95, e demais dispositivos legais aplicáveis, para fins de redução da base de cálculo do IRPJ e da CSLL sobre as receitas oriundas de <b>serviços hospitalares</b>.")}
${p(`${bold("§1º — Segregação das receitas")}`)}
${p("A CONTRATANTE compromete-se a <b>segregar mensalmente</b> suas receitas, informando à CONTRATADA a distinção entre:")}
${p("• <b>Serviços hospitalares</b>, caracterizados por procedimentos invasivos, cirúrgicos ou realizados com estrutura equiparada à hospitalar;")}
${p("• <b>Demais serviços odontológicos</b>, sem natureza hospitalar.")}
${p("A planilha de segregação deverá ser encaminhada até o <b>5º (quinto) dia útil de cada mês</b>, acompanhada dos comprovantes necessários.")}

${p(`${bold("§2º — Bases de cálculo e alíquotas aplicáveis")}`)}
${p("As partes reconhecem que, no <b>regime de Lucro Presumido</b>, a apuração dos tributos federais ocorre sobre <b>percentuais presumidos da receita bruta</b>, conforme o tipo de serviço prestado, resultando nas seguintes <b>alíquotas efetivas</b> sobre o faturamento:")}

<table style="width:100%;border-collapse:collapse;margin:8pt 0;font-size:9pt;">
<tr style="background:#1a365d;color:#fff;">
  <th style="padding:6pt;border:1pt solid #ccc;text-align:left;">Tipo de Serviço</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Imposto</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Base Presumida</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Alíq. Tributo</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Alíq. Efetiva</th>
</tr>
<tr><td style="padding:4pt;border:1pt solid #ccc;" rowspan="5"><b>Hospitalar (Equiparação)</b></td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">IRPJ</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">8%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">15%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">1,20%</td></tr>
<tr><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">CSLL</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">12%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">9%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">1,08%</td></tr>
<tr><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">PIS</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">—</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">0,65%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">0,65%</td></tr>
<tr><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">COFINS</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">—</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">3,00%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">3,00%</td></tr>
<tr><td colspan="3" style="padding:4pt;border:1pt solid #ccc;text-align:right;font-weight:700;">Total tributos federais hospitalares</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">5,93%</td></tr>

<tr><td style="padding:4pt;border:1pt solid #ccc;" rowspan="5"><b>Não hospitalar (Demais serviços)</b></td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">IRPJ</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">32%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">15%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">4,80%</td></tr>
<tr><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">CSLL</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">32%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">9%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">2,88%</td></tr>
<tr><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">PIS</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">—</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">0,65%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">0,65%</td></tr>
<tr><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">COFINS</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">—</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">3,00%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">3,00%</td></tr>
<tr><td colspan="3" style="padding:4pt;border:1pt solid #ccc;text-align:right;font-weight:700;">Total tributos federais não hospitalares</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;font-weight:700;">11,33%</td></tr>
</table>

${p("<b>Obs.:</b> As alíquotas acima referem-se aos tributos <b>federais (IRPJ, CSLL, PIS e COFINS)</b>. A alíquota de <b>ISS municipal</b> conforme a legislação do município de Belo Horizonte está em 3%.")}

${p(`${bold("§3º — Responsabilidade pela informação e comprovação")}`)}
${p("A CONTRATANTE é responsável por:")}
${p("1. Identificar corretamente as receitas de natureza hospitalar e não hospitalar;")}
${p("2. Manter sob sua guarda os documentos comprobatórios (notas fiscais, prontuários, relatórios de procedimentos etc.);")}
${p("3. Fornecer informações verídicas e completas à CONTRATADA para fins de apuração tributária.")}
${p("A CONTRATADA aplicará as alíquotas reduzidas <b>somente sobre as receitas devidamente comprovadas e informadas</b> como hospitalares, isentando-se de qualquer responsabilidade por autuação fiscal decorrente de omissão, erro ou ausência de comprovação documental.")}

${p(`${bold("§4º — Falta de segregação")}`)}
${p("Caso a CONTRATANTE <b>não apresente as informações de segregação</b> no prazo estabelecido, a CONTRATADA aplicará, por padrão, as bases de cálculo de <b>32% para IRPJ e CSLL</b>, e as alíquotas de <b>0,65% (PIS)</b> e <b>3,00% (COFINS)</b> sobre a totalidade do faturamento, até que seja regularizada a segregação documental.")}

${p(`${bold("§5º — Transparência tributária")}`)}
${p("As alíquotas descritas nesta cláusula têm caráter <b>informativo e orientativo</b>, podendo ser alteradas por força de legislação superveniente. A CONTRATANTE será comunicada pela CONTRATADA em caso de atualização ou mudança normativa que impacte a apuração dos tributos federais.")}

${sec("CLÁUSULA DÉCIMA PRIMEIRA — DA MULTA POR ATRASO")}
${p("No caso de atraso no pagamento dos honorários, incidirá multa de 10% (dez por cento). Persistindo o atraso, por período de 3 (três) meses, o CONTRATADO poderá rescindir o contrato, por motivo justificado, eximindo-se de qualquer responsabilidade a partir da data da rescisão.")}

${sec("CLÁUSULA DÉCIMA SEGUNDA — DOS SERVIÇOS EXTRAORDINÁRIOS")}
${p("Todos os serviços extraordinários não contratados que forem necessários ou solicitados pelo CONTRATANTE serão cobrados à parte, com preços previamente convencionados, exemplificativamente:")}
${p("01) Alteração contratual;")}
${p("02) Abertura de empresa;")}
${p("03) Declaração de ajuste do Imposto de renda pessoa física;")}
${p("04) Preenchimento de fichas cadastrais/IBGE;")}
${p("05) Encerramento de empresas.")}

${sec("CLÁUSULA DÉCIMA TERCEIRA — DA VIGÊNCIA E RESCISÃO")}
${p(`Este instrumento é feito por tempo indeterminado, iniciando-se em ${bold(d.vig_inicio || "________")}, podendo ser rescindido em qualquer época, por qualquer uma das partes, mediante Aviso Prévio de 30 (trinta) dias, por escrito.`)}
${p(`${bold("PARÁGRAFO PRIMEIRO")} - A parte que não comunicar por escrito a intenção de rescindir o contrato ou efetuá-la de forma sumária fica obrigada ao pagamento de multa compensatória no valor de uma parcela mensal dos honorários vigentes à época.`)}
${p(`${bold("PARÁGRAFO SEGUNDO")} - O rompimento do vínculo contratual obriga as partes à celebração de distrato com a especificação da cessação das responsabilidades dos contratantes.`)}
${p(`${bold("PARÁGRAFO TERCEIRO")} - O CONTRATADO obriga-se a entregar os documentos, Fiscais e/ou arquivos eletrônicos ao contratante ou a outro profissional da Contabilidade por ele indicado, após a assinatura do distrato entre as partes.`)}

${sec("CLÁUSULA DÉCIMA QUARTA — DOS CASOS OMISSOS")}
${p("Os casos omissos serão resolvidos de comum acordo.")}
${p(`${bold("PARÁGRAFO ÚNICO")} - Em caso de impasse, as partes submeterão a solução do conflito a procedimento arbitral nos termos da Lei n.º 9.307/96.`)}

${sec("CLÁUSULA DÉCIMA QUINTA — DO FORO")}
${p(`Fica eleito o foro da comarca de ${d.vig_foro}, para o fim de dirimir qualquer ação oriunda do presente contrato.`)}

${p("E, para firmeza e como prova de assim haverem contratado, firmam este instrumento particular, impresso em duas vias de igual teor e forma, assinado pelas partes contratantes.")}

${p(`${d.vig_local_data || "Belo Horizonte, __ de ________ de ____"}`)}

<div style="margin-top:40pt;display:flex;justify-content:space-between;gap:40pt;">
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${d.ct_razao || "________"} - CONTRATANTE</b><br/>
    CNPJ: ${d.ct_cnpj || "________"}<br/>
    Sócio Administrador: ${d.ct_socio_nome || "________"}<br/>
    CPF: ${d.ct_socio_cpf || "________"}
  </div>
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${d.cd_razao} – CONTRATADA</b><br/>
    CNPJ: ${d.cd_cnpj}<br/>
    Sócia Administradora: ${d.cd_socia_nome}<br/>
    CPF: ${d.cd_socia_cpf}
  </div>
</div>`;
}

function exportDOCX(d) {
  const html = buildContractHTML(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}table{border-collapse:collapse;}td,th{padding:4pt;border:1pt solid #ccc;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Contrato_Prestacao_Servicos_${(d.ct_razao || "Contratante").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDF(d) {
  const html = buildContractHTML(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}table{border-collapse:collapse;width:100%;}td,th{padding:4pt;border:1pt solid #ccc;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   EXPORT — PARCERIA SALÃO
   ════════════════════════════════════════════ */
function buildContractHTMLParceria(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  const tabelaRows = [1,2,3].map(i => {
    const s = d[`cond_tabela_servico${i}`];
    const pp = d[`cond_tabela_parceiro${i}`];
    const sp = d[`cond_tabela_salao${i}`];
    if (!s && !pp && !sp) return "";
    return `<tr><td style="padding:4pt;border:1pt solid #ccc;">${_(s)}</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(pp)}%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(sp)}%</td></tr>`;
  }).join("");

  return `
<h1 style="font-size:14pt;text-align:center;margin-bottom:20pt;letter-spacing:0.5pt;font-weight:700;">CONTRATO DE PARCERIA ENTRE SALÃO-PARCEIRO E PROFISSIONAL-PARCEIRO CONFORME LEI 13352/16</h1>

${sec("I - DAS PARTES")}

${p("Assinam o presente instrumento, nele assumindo, cada uma delas, a seu título, direitos e obrigações, as seguintes partes:")}

${p(`Como ${b("SALÃO-PARCEIRO")}: ${b(_(d.sp_razao))}, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº ${_(d.sp_cnpj)}, com sede na ${_(d.sp_endereco)}, n° ${_(d.sp_numero)}, bairro ${_(d.sp_bairro)}, em ${_(d.sp_cidade_uf)}, CEP ${_(d.sp_cep)}, telefone ${_(d.sp_telefone)}, e-mail ${_(d.sp_email)}, neste ato representado pelo(a) sócio(a) administrador(a) ${b(_(d.sp_socio1_nome))}, ${_(d.sp_socio1_nacionalidade)}, ${_(d.sp_socio1_estado_civil)}, ${_(d.sp_socio1_profissao)}, inscrito(a) no CPF/MF sob o n° ${_(d.sp_socio1_cpf)}, portador(a) da cédula de identidade ${_(d.sp_socio1_rg)}, residente e domiciliado(a) na ${_(d.sp_socio1_endereco)}, n° ${_(d.sp_socio1_numero)}, bairro ${_(d.sp_socio1_bairro)}, em ${_(d.sp_socio1_cidade_uf)}, CEP ${_(d.sp_socio1_cep)}.`)}

${p(`Como ${b("PROFISSIONAL-PARCEIRO")}: ${b(_(d.pp_nome))}, ${_(d.pp_nacionalidade)}, ${_(d.pp_estado_civil)}, ${_(d.pp_profissao)}, inscrito(a) no CPF/MF sob o n° ${_(d.pp_cpf)}, profissional autônomo(a) classificado(a) como Microempreendedor(a) Individual - MEI e inscrito(a) no CNPJ/MF sob o nº ${_(d.pp_cnpj_mei)}, residente e domiciliado(a) na ${_(d.pp_endereco)}, n° ${_(d.pp_numero)}, bairro ${_(d.pp_bairro)}, em ${_(d.pp_cidade_uf)}, CEP ${_(d.pp_cep)}, Fone/Cel. ${_(d.pp_telefone)}, e-mail ${_(d.pp_email)}.`)}

${p("As partes, após terem lido e compreendido o sentido e alcance das cláusulas, resolvem pactuar o presente Instrumento Particular de Parceria para Prestação de Serviços em Salão de Beleza, em consonância com o que estabelece a Lei n° 13.352/2016, submetendo-se às cláusulas e condições seguintes, tendo entre si certo e ajustado seus termos, nele assumindo, cada uma delas, a seu título, respectivamente, direitos e obrigações.")}

${sec("II - DO OBJETO DO CONTRATO")}

${p(`${b("Cláusula Primeira:")} O presente contrato tem como objeto a celebração de parceria entre as partes, em que o PROFISSIONAL PARCEIRO prestará os serviços de: ${b(_(d.cond_servicos))}, dentro do espaço fornecido pelo SALÃO PARCEIRO, tudo de acordo com os termos estabelecidos neste instrumento.`)}

${sec("III – DOS PERCENTUAIS E CONDIÇÕES DO REPASSE")}

${p(`${b("Cláusula Segunda:")} O SALÃO-PARCEIRO será responsável pela centralização dos recursos decorrentes das atividades de prestação de serviços de beleza realizadas pelo PROFISSIONAL-PARCEIRO, sendo que todos os pagamentos dos clientes serão recebidos, na sua integralidade pelo SALÃO-PARCEIRO.`)}

${p(`${b("Cláusula Terceira:")} Dos pagamentos dos clientes pelos serviços prestados pelo PROFISSIONAL-PARCEIRO, o SALÃO-PARCEIRO realizará a retenção de sua quota-parte percentual, fixada, para cada serviço, nos percentuais descritos na tabela abaixo, a qual é parte integrante deste instrumento, além da retenção dos valores de recolhimento de tributos, contribuições sociais e previdenciárias incidentes sobre a cota-parte, devidas pelo(a) PROFISSIONAL-PARCEIRO ao fisco.`)}

<table style="width:100%;border-collapse:collapse;margin:8pt 0;">
<tr style="background:#1a365d;color:#fff;">
  <th style="padding:6pt;border:1pt solid #ccc;text-align:left;">Serviços</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Comissão Parceiro</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Comissão Salão</th>
</tr>
${tabelaRows || `<tr><td style="padding:4pt;border:1pt solid #ccc;">________</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">________%</td><td style="padding:4pt;border:1pt solid #ccc;text-align:center;">________%</td></tr>`}
</table>

${p(`${b("Parágrafo Primeiro:")} A quota-parte do PROFISSIONAL-PARCEIRO corresponderá, portanto, ao remanescente do valor descrito no caput desta cláusula.`)}
${p(`${b("Parágrafo Segundo:")} A cópia dos comprovantes dos impostos, contribuições sociais e previdenciárias retidas e recolhidos pelo SALÃO-PARCEIRO, serão por ele mantidas e os originais serão repassados ao PROFISSIONAL-PARCEIRO.`)}
${p(`${b("Parágrafo Terceiro:")} A quota-parte do SALÃO-PARCEIRO, no percentual determinado no caput desta cláusula, ocorrerá a título de atividade de aluguel de espaço físico, bens móveis e utensílios para o desempenho das atividades de serviços de beleza, bem como a título de serviços de gestão, de apoio administrativo, de escritório, de recepção de clientes e marcação de horário, de cobrança e de recebimentos de valores transitórios recebidos de clientes das atividades de serviços de beleza. Já a quota-parte destinada ao PROFISSIONAL-PARCEIRO ocorrerá a título de atividades de prestação de serviços de beleza.`)}

${p(`${b("Cláusula Quarta:")} O pagamento do percentual do PROFISSIONAL-PARCEIRO será feito pelo SALÃO-PARCEIRO sempre nos dias ${b(_(d.cond_dia_pagamento))} de cada mês, mediante depósito em conta bancária do PROFISSIONAL-PARCEIRO, devendo depois de confirmado o crédito assinar recibo, se exigido.`)}

${sec("IV - UTILIZAÇÃO DO MATERIAL E DO ESPAÇO FÍSICO")}

${p(`${b("Cláusula Quinta:")} O SALÃO-PARCEIRO pelo percentual ajustado na Cláusula Terceira cederá para prestação do serviço de beleza do PROFISSIONAL-PARCEIRO o mobiliário, local para o trabalho e tudo relativo à estrutura física e seus acessórios, como energia elétrica, água, telefone, além de disponibilizar secretária e demais recursos necessários ao bom atendimento dos clientes.`)}

${p(`${b("Cláusula Sexta:")} Para prestação do serviço descrito na Cláusula Primeira, o PROFISSIONAL-PARCEIRO fornecerá toda a sua mão-de-obra especializada, bem como os materiais e ferramentas próprios de seu ofício necessários à execução dos serviços.`)}

${p(`${b("Cláusula Sétima:")} Para o bom desempenho de suas funções, o PROFISSIONAL-PARCEIRO utilizará e se encarregará de manter os equipamentos e ferramentas necessários à prestação de seus serviços em perfeitas condições de uso, arcando por danos causados aos equipamentos decorrentes de má utilização, não sendo de responsabilidade do SALÃO-PARCEIRO o fornecimento de qualquer material, que não os relacionados na Cláusula Quinta.`)}

${p(`${b("Cláusula Oitava:")} É vedado ao PROFISSIONAL-PARCEIRO utilizar as instalações do SALÃO-PARCEIRO, para qualquer outro fim que não para a prestação dos serviços objeto do presente contrato.`)}

${p(`${b("Cláusula Nona:")} O PROFISSIONAL-PARCEIRO exercerá suas atividades e prestação de serviço de beleza com plena autonomia, podendo circular livremente pelas dependências do SALÃO-PARCEIRO, mas a prestação do serviço deverá ocorrer estritamente no ambiente selecionado para seu uso, devendo respeitar a divisão de ambientes para cada tipo de serviço e profissional, salvo quando o cliente estiver em outro setor, sendo atendida por outro profissional, ocasião em que a prestação de serviço do PROFISSIONAL-PARCEIRO poderá ocorrer fora do espaço reservado.`)}

${p(`${b("Cláusula Décima:")} Quando o estabelecimento estiver fechado, o PROFISSIONAL-PARCEIRO não poderá utilizá-lo, salvo mediante prévia e expressa autorização do SALÃO-PARCEIRO e na presença dos proprietários ou gerente.`)}

${sec("V – DA MARCAÇÃO DE HORÁRIOS E CONTROLE DE AGENDA")}

${p(`${b("Cláusula Décima Primeira:")} O PROFISSIONAL-PARCEIRO possui autonomia sobre sua agenda. No entanto, para melhor organização do estabelecimento, os horários poderão ser marcados pelos clientes diretamente na recepção do SALÃO-PARCEIRO, com as recepcionistas, tendo o PROFISSIONAL-PARCEIRO total controle e acesso sobre a mesma, para consultas e alterações de horários.`)}

${p(`${b("Cláusula Décima Segunda:")} O PROFISSIONAL-PARCEIRO é livre para decidir quais os dias e horários não prestará atendimento à sua clientela, entretanto, deverá avisar ao SALÃO-PARCEIRO com antecedência mínima de 48 (quarenta e oito) horas solicitando o remanejo e bloqueio destes horários.`)}
${p(`${b("Parágrafo Único:")} O bloqueio de agenda a que se refere o caput desta Cláusula só será efetivado mediante assinatura de documento específico pelo PROFISSIONAL-PARCEIRO ou envio de mensagem WhatsApp ao SALÃO-PARCEIRO.`)}

${sec("VI – DAS OBRIGAÇÕES DO PROFISSIONAL PARCEIRO")}

${p(`${b("Cláusula Décima Terceira:")} É responsabilidade do PROFISSIONAL-PARCEIRO, juntamente com o SALÃO-PARCEIRO manter a higiene de materiais e equipamentos, e as condições de funcionamento do negócio bem como o bom atendimento dos clientes.`)}

${p(`${b("Cláusula Décima Quarta:")} O PROFISSIONAL-PARCEIRO compromete-se a executar as atividades profissionais objeto deste instrumento com ética, zelo e eficiência, dentro das técnicas consagradas de mercado, a fim de não denegrir o nome do estabelecimento ao qual representa, bem como a cumprir as normas de segurança e saúde, as quais declara conhecer.`)}
${p(`${b("Parágrafo Primeiro:")} Os produtos descritos na Cláusula Sexta e utilizados na prestação dos serviços objeto deste instrumento pelo PROFISSIONAL-PARCEIRO são de sua inteira responsabilidade, inclusive no que diz respeito ao descarte de materiais que não podem ser reaproveitados bem como à qualidade e observação da data de validade dos produtos, devendo utilizar os que possuem reconhecimento e aprovação pelos órgãos fiscalizadores, como ANVISA (Agência Nacional de Vigilância Sanitária).`)}
${p(`${b("Parágrafo Segundo:")} Caberá ao PROFISSIONAL-PARCEIRO organizar, limpar, desinfetar e esterilizar os instrumentos de trabalho, utilizando produtos e procedimentos específicos, conforme normas de higiene para conservação em condições de uso, evitar contaminações e preservar a sua saúde, bem como a dos clientes.`)}
${p(`${b("Parágrafo Terceiro:")} Na hipótese do SALÃO-PARCEIRO ser multado pela Vigilância Sanitária em razão de descumprimento de norma pelo PROFISSIONAL-PARCEIRO, o valor da multa será dividido entre as partes contratantes, proporcionalmente aos percentuais de pagamento descritos na Cláusula Terceira.`)}

${p(`${b("Cláusula Décima Quinta:")} Os preços dos serviços de beleza praticados pelo PROFISSIONAL-PARCEIRO não poderão ser inferiores aos preços estabelecidos pelo SALÃO PARCEIRO, constantes de tabela afixada no estabelecimento.`)}

${p(`${b("Cláusula Décima Sexta:")} O PROFISSIONAL-PARCEIRO participará das promoções que o SALÃO-PARCEIRO oferecer aos clientes, sendo que o ônus de tais promoções será dividido entre as partes contratantes.`)}

${p(`${b("Cláusula Décima Sétima:")} Os produtos comercializados aos clientes pelo SALÃO-PARCEIRO nas dependências do estabelecimento, obedecerão à tabela de preços fornecida pelo SALÃO-PARCEIRO, não podendo o PROFISSIONAL-PARCEIRO comercializar quaisquer outros produtos sem a prévia e expressa autorização do SALÃO-PARCEIRO.`)}
${d.cond_comissao_produtos ? `${p(`${b("Parágrafo Primeiro:")} O PROFISSIONAL-PARCEIRO terá direito à comissão de ${_(d.cond_comissao_produtos)} (${_(d.cond_comissao_produtos_extenso)}) sobre o valor da venda dos produtos comercializados pelo SALÃO-PARCEIRO, conforme descrito no caput desta cláusula, desde que a venda tenha sido realizada pelo PROFISSIONAL-PARCEIRO.`)}
${p(`${b("Parágrafo Segundo:")} O pagamento da comissão a que se refere o parágrafo anterior, será feito juntamente com o pagamento da quota-parte do PROFISSIONAL-PARCEIRO, nos termos da Cláusula Quarta deste instrumento.`)}` : ""}

${p(`${b("Cláusula Décima Oitava:")} Incluem na responsabilidade do PROFISSIONAL-PARCEIRO os custos de correção de serviços mal executados, inclusive com produtos, não tendo o SALÃO-PARCEIRO qualquer responsabilidade reflexa.`)}

${p(`${b("Cláusula Décima Nona:")} O PROFISSIONAL-PARCEIRO declara estar ciente de que o SALÃO-PARCEIRO possui outros profissionais contratados e se compromete a não promover, em hipótese alguma, disputas, concorrências desleais ou outro tipo de desacordo que desestabilize a harmonia do ambiente, por entender que a parceria deve ser justa e usada com ética entre toda a equipe.`)}

${p(`${b("Cláusula Vigésima:")} O PROFISSIONAL-PARCEIRO obriga-se a manter a regularidade de sua inscrição perante as autoridades fazendárias, podendo optar entre as qualificações de pequeno empresário, microempresário ou microempreendedor individual.`)}
${p(`${b("Parágrafo Único:")} O regime previdenciário é de livre escolha do PROFISSIONAL-PARCEIRO.`)}

${sec("VII – DAS OBRIGAÇÕES DO SALÃO PARCEIRO")}

${p(`${b("Cláusula Vigésima Primeira:")} Cabe ao SALÃO-PARCEIRO a preservação e a manutenção de condições adequadas de trabalho do PROFISSIONAL-PARCEIRO, especialmente no tocante às instalações, possibilitando o cumprimento das normas de segurança e saúde.`)}

${p(`${b("Cláusula Vigésima Segunda:")} É responsabilidade do SALÃO-PARCEIRO juntamente com o PROFISSIONAL-PARCEIRO a manutenção e higiene de materiais e equipamentos, das condições de funcionamento do negócio e do bom atendimento dos clientes, bem como o cumprimento das normas de saúde e segurança.`)}

${p(`${b("Cláusula Vigésima Terceira:")} Cabe, exclusivamente, ao SALÃO-PARCEIRO a administração de sua pessoa jurídica e as obrigações e responsabilidades de ordem contábil, fiscal, trabalhista e previdenciária incidentes, ou quaisquer outras relativas ao funcionamento do negócio, não tendo o PROFISSIONAL-PARCEIRO qualquer participação ou responsabilidade quanto a esses aspectos.`)}

${p(`${b("Cláusula Vigésima Quarta:")} O SALÃO-PARCEIRO compromete-se a administrar de forma competente o recebimento dos valores pagos pelos clientes, mantendo o controle através de documentos (planilhas eletrônicas e livros contábeis) de fácil compreensão, a fim de manter o máximo de transparência e prestar contas sempre que solicitado pelo PROFISSIONAL-PARCEIRO.`)}

${p(`${b("Cláusula Vigésima Quinta:")} A recepção dos clientes será obrigação do SALÃO-PARCEIRO, o qual deverá manter pessoa capacitada para exercer tal mister, sendo que as obrigações trabalhistas e salariais decorrentes desta obrigação são de responsabilidade única e exclusiva do SALÃO-PARCEIRO, estando os custos incluído em sua quota-parte.`)}

${p(`${b("Cláusula Vigésima Sexta:")} O SALÃO-PARCEIRO será o único responsável pela retenção e pelo recolhimento junto ao fisco, dos tributos, taxas, contribuições sociais e previdenciárias devidos pelo PROFISSIONAL-PARCEIRO em decorrência da atividade deste na parceria, valor que será descontado sobre a quota-parte do percentual que couber ao PROFISSIONAL-PARCEIRO, nos termos do artigo 1°-A, §3°, da Lei n° 13.352/2016 e conforme pactuado na Cláusula Terceira deste instrumento.`)}

${sec("VIII – DA PROPAGANDA E DO DIREITO DE IMAGEM")}

${p(`${b("Cláusula Vigésima Sétima:")} Não se incluem nas obrigações do SALÃO-PARCEIRO a propaganda individual do PROFISSIONAL-PARCEIRO ou qualquer outra forma de promoção que não seja atinente tão-somente ao estabelecimento como um todo.`)}
${p(`${b("Parágrafo Primeiro:")} A publicidade ou propaganda que o SALÃO-PARCEIRO eventualmente vir a fazer para o PROFISSIONAL-PARCEIRO ocorrerá por mera liberalidade, não tendo qualquer obrigação de dar continuidade à mesma.`)}
${p(`${b("Parágrafo Segundo:")} Para fins de publicidade, o PROFISSIONAL-PARCEIRO cede, neste ato, a título gratuito, os direitos de imagem ao SALÃO-PARCEIRO, ficando este autorizado e livre de qualquer ônus, a utilizar imagens do PROFISSIONAL-PARCEIRO e de seus serviços para fins exclusivos de divulgação e propaganda do estabelecimento como um todo, podendo tanto reproduzir as imagens como divulgá-las em jornais, Internet e redes sociais, TV, bem como em todos os demais meios de comunicação pública ou privada.`)}

${sec("IX – DA RESPONSABILIDADE POR DANOS A TERCEIROS")}

${p(`${b("Cláusula Vigésima Oitava:")} Os serviços que o PROFISSIONAL-PARCEIRO se propõe a realizar, utilizando-se do equipamento e do espaço, objetos deste contrato, são de sua inteira e exclusiva responsabilidade, declarando, para tanto, ser conhecedor das especificações técnicas dos produtos utilizados, obrigando-se a prestar ao cliente, de forma clara, precisa e adequada, todas as informações necessárias sobre sua correta utilização, especialmente no que se referem à quantidade, características, manuseio, qualidade, preço e risco que representam.`)}
${p(`${b("Parágrafo Primeiro:")} O PROFISSIONAL-PARCEIRO responderá, perante seus clientes e terceiros, por quaisquer danos, decorrentes de imperícia ou negligência, a que der causa na execução dos serviços objetos deste instrumento, eximindo integralmente o SALÃO-PARCEIRO de qualquer responsabilidade ou ônus.`)}
${p(`${b("Parágrafo Segundo:")} Nenhuma responsabilidade caberá ao SALÃO-PARCEIRO na relação entre PROFISSIONAL-PARCEIRO e cliente, seja de ordem moral, profissional (qualidade dos serviços) ou outra que implique em responsabilidade civil ou criminal.`)}

${sec("X – DA INEXISTÊNCIA DE VÍNCULO EMPREGATÍCIO OU SOCIETÁRIO")}

${p(`${b("Cláusula Vigésima Nona:")} Não constitui o presente contrato qualquer relação jurídica de emprego ou de sociedade entre SALÃO-PARCEIRO e PROFISSIONAL-PARCEIRO, estando plenamente resguardada a autonomia do PROFISSIONAL-PARCEIRO na prática de sua atividade profissional, nos moldes da Lei n° 13.352, de 27 de outubro de 2016.`)}

${p(`${b("Cláusula Trigésima:")} Não existem hierarquia ou subordinação na relação entre PROFISSIONAL-PARCEIRO e SALÃO-PARCEIRO, devendo as partes tratar-se com consideração e respeito recíprocos, atuando em regime de colaboração mútua.`)}

${sec("XI – DO PRAZO DE VIGÊNCIA E RESCISÃO CONTRATUAL")}

${p(`${b("Cláusula Trigésima Primeira:")} O presente contrato passa a vigorar a partir da data de sua assinatura e possui prazo de vigência de 12 meses, podendo ser rescindido unilateralmente por qualquer das partes, a qualquer tempo, sem prejuízo quanto à responsabilidade legal e contratual aplicáveis, desde que haja prévio aviso, por escrito, com antecedência mínima de 30 (trinta) dias.`)}

${p(`${b("Cláusula Trigésima Segunda:")} O presente contrato poderá ser rescindido por qualquer das Partes, independentemente de aviso ou notificações, nos seguintes casos:`)}
${p("a) Houver danos físicos, morais ou patrimoniais praticados por uma parte à outra, aos clientes ou ao estabelecimento;")}
${p("b) Prática, por qualquer das partes, de ato ilícito, civil ou penal, ou qualquer tipo de constrangimento físico ou moral grave aos clientes, que venha a comprometer o nome do estabelecimento ou da Parte, incluindo neste item o descaso e a desídia com seus clientes.")}

${p(`${b("Cláusula Trigésima Terceira:")} Nenhuma das partes será responsável perante a outra por qualquer falha ou atraso no desempenho de qualquer das obrigações assumidas e constantes do presente, desde que causados por evento de força maior ou de caso fortuito, quando tais eventos forem, ao mesmo tempo, imprevisíveis e intransponíveis, devendo a parte inadimplente dar ciência à outra, por escrito inclusive via WhatsApp, em até 48 (quarenta e oito) horas da data da ocorrência, fornecendo informações completas sobre o evento.`)}

${p(`${b("Cláusula Trigésima Quarta:")} Por ocasião da rescisão do presente contrato, seja pelas Cláusulas Trigésima Primeira ou Trigésima Segunda, compromete-se o PROFISSIONAL-PARCEIRO a entregar as instalações do SALÃO-PARCEIRO no mesmo estado em que as recebeu, inclusive os materiais descritos na Cláusula Quinta, responsabilizando-se por qualquer dano que porventura venha a dar causa pelo uso inadequado dos mesmos, autorizando, desde já, o SALÃO-PARCEIRO a proceder ao bloqueio de possíveis créditos seus, como forma de garantia do ressarcimento dos danos causados, ressalvadas as despesas decorrentes do desgaste natural das instalações e dos materiais, que serão de responsabilidade do SALÃO-PARCEIRO.`)}

${p(`${b("Cláusula Trigésima Quinta:")} Na hipótese de rescisão contratual, tanto pela Cláusula Trigésima Primeira, quanto pela Cláusula Trigésima Segunda, será devido ao PROFISSIONAL-PARCEIRO sua quota-parte percentual relativa aos serviços que tiver realizado até a data do distrato, devendo o SALÃO-PARCEIRO realizar os repasses dos valores devidos no momento da assinatura do instrumento de distrato.`)}

${sec("XII – DA CESSÃO OU TRANSFERÊNCIA DO CONTRATO")}

${p(`${b("Cláusula Trigésima Sexta:")} O PROFISSIONAL-PARCEIRO declara expressamente reconhecer que foi selecionado, para firmar este instrumento, tendo em vista as suas habilidades profissionais, pelo que não poderá ceder ou transferir, no todo ou em parte, a qualquer título e a quem quer que seja, os seus direitos e/ou obrigações decorrentes deste contrato, ou de qualquer aditamento que venha a ser celebrado entre as partes.`)}

${sec("XIV - DAS DISPOSIÇÕES GERAIS")}

${p(`${b("Cláusula Trigésima Sétima:")} A Parte que tiver alterado o endereço constante do preâmbulo deste instrumento deverá, imediatamente e por escrito, comunicar o novo endereço a outra Parte.`)}
${p(`${b("Parágrafo Único:")} Até que seja feita a comunicação a que se refere o caput desta cláusula, serão válidos e eficazes os avisos, comunicações, notificações e interpelações enviadas para o endereço constante do preâmbulo deste contrato.`)}

${p(`${b("Cláusula Trigésima Oitava:")} As partes se dão plena e geral quitação por quaisquer outros contratos ou obrigações anteriormente pactuadas, os quais, através da assinatura do presente contrato, ficam extintos de pleno direito.`)}

${p(`${b("Cláusula Trigésima Nona:")} A eventual tolerância à infringência de qualquer das cláusulas desse instrumento ou o não exercício de qualquer direito nele previsto, constituirá mera liberalidade, não implicando em novação ou transação de qualquer espécie.`)}

${p(`${b("Cláusula Quadragésima:")} O presente contrato rege-se pela Lei n° 13.352, de 27 de outubro de 2016, e demais dispositivos legais pertinentes à espécie, os quais as Partes declaram conhecer e que serão aplicados nas hipóteses em que o presente contrato for omisso.`)}
${p(`${b("Parágrafo Único:")} Na eventualidade de qualquer disposição deste contrato ser considerada nula, anulável, inválida ou ineficaz, as demais disposições deste instrumento permanecerão em pleno vigor, válidas e exequíveis, devendo as partes negociar um ajuste equânime da disposição considerada nula, anulável, inválida ou ineficaz de modo a assegurar a respectiva validade e exequibilidade.`)}

${p(`${b("Cláusula Quadragésima Primeira:")} As Partes declaram expressamente que a presente avença atende aos princípios da boa-fé, em cumprimento à função social do contrato, não importando, em hipótese alguma, em abuso de direito, a qualquer título.`)}

${sec("XV – DA ELEIÇÃO DE FORO")}

${p(`${b("Cláusula Quadragésima Segunda:")} As Partes elegem o foro da cidade de ${b(_(d.vig_cidade_uf))} - MG, para dirimir quaisquer dúvidas provenientes da execução e cumprimento do presente instrumento, com renúncia expressa a qualquer outro foro, por mais especial ou privilegiado que seja ou que venha a ser.`)}

${p("E por estarem justos e contratados, as Partes assinam o presente contrato em 04 (quatro) vias de igual forma e teor, na presença de 02 (duas) testemunhas, sendo que uma das vias irá para os arquivos do sindicato patronal e a outra para o sindicato laboral se existir.")}

${p(`${_(d.vig_cidade_uf)}, ${_(d.vig_dia)} de ${_(d.vig_mes)} de ${_(d.vig_ano)}`)}

<div style="margin-top:40pt;display:flex;justify-content:space-between;gap:40pt;">
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>SALÃO-PARCEIRO</b>
  </div>
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>PROFISSIONAL-PARCEIRO</b>
  </div>
</div>

<div style="margin-top:30pt;display:flex;justify-content:space-between;gap:40pt;">
  <div style="flex:1;border-top:1pt solid #333;padding-top:6pt;font-size:10pt;">
    Testemunha: ________<br/>Nome: ________<br/>CPF: ________<br/>Identidade: ________
  </div>
  <div style="flex:1;border-top:1pt solid #333;padding-top:6pt;font-size:10pt;">
    Testemunha: ________<br/>Nome: ________<br/>CPF: ________<br/>Identidade: ________
  </div>
</div>`;
}

function exportDOCXParceria(d) {
  const html = buildContractHTMLParceria(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}table{border-collapse:collapse;}td,th{padding:4pt;border:1pt solid #ccc;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Contrato_Parceria_Salao_${(d.sp_razao || "Salao").replace(/\s+/g, "_")}_${(d.pp_nome || "Profissional").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFParceria(d) {
  const html = buildContractHTMLParceria(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}table{border-collapse:collapse;width:100%;}td,th{padding:4pt;border:1pt solid #ccc;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   EXPORT — CONTRATO SOCIAL
   ════════════════════════════════════════════ */
function buildSocioText(d, prefix) {
  const parts = [];
  parts.push(d[`${prefix}_nacionalidade`] || "________");
  if (d[`${prefix}_nascido_exterior`]) parts.push(d[`${prefix}_nascido_exterior`]);
  parts.push(d[`${prefix}_estado_civil`] || "________");
  parts.push(d[`${prefix}_profissao`] || "________");
  parts.push(`nascida em ${d[`${prefix}_nascimento`] || "________"}`);
  parts.push(`portadora do CPF nº ${d[`${prefix}_cpf`] || "________"} e ID nº ${d[`${prefix}_rg`] || "________"}`);
  parts.push(`residente e domiciliada à ${d[`${prefix}_endereco`] || "________"}, CEP ${d[`${prefix}_cep`] || "________"}`);
  return parts.join(", ");
}

function buildContractHTMLSocial(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  const enqTexto = d.enq_tipo === "EPP"
    ? "inciso II do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006"
    : "inciso I do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006";

  const objetos = [d.emp_objeto_1, d.emp_objeto_2, d.emp_objeto_3].filter(Boolean);

  return `
<h1 style="font-size:15pt;text-align:center;margin-bottom:6pt;letter-spacing:0.5pt;font-weight:700;">CONTRATO SOCIAL</h1>
<h2 style="font-size:13pt;text-align:center;margin-bottom:20pt;font-weight:700;color:#1a365d;">${_(d.emp_denominacao)}</h2>

${p(`${b(_(d.s1_nome).toUpperCase())}, ${buildSocioText(d, "s1")};`)}
${p(`${b(_(d.s2_nome).toUpperCase())}, ${buildSocioText(d, "s2")};`)}

${p(`Resolvem constituir uma sociedade empresária limitada, que se regerá pelas cláusulas seguintes e pela Lei nº 10.406/2002.`)}

${sec("CLÁUSULA 1ª – DA DENOMINAÇÃO, SEDE E PRAZO")}
${p(`A sociedade girará sob a denominação social: ${b(_(d.emp_denominacao))}, com sede à ${_(d.emp_endereco)}, CEP ${_(d.emp_cep)} e o prazo de duração é indeterminado.`)}

${sec("CLÁUSULA 2ª – DO OBJETO SOCIAL")}
${p("A sociedade terá por objeto:")}
${objetos.length > 0 ? objetos.map((o, i) => p(`${["I", "II", "III"][i]} – ${o}`)).join("\n") : p("I – ________")}

${sec("CLÁUSULA 3ª – DO CAPITAL SOCIAL")}
${p(`O capital social é de R$ ${_(d.cap_total)} (${_(d.cap_total_extenso)}), dividido em ${_(d.cap_num_quotas)}(${_(d.cap_num_quotas_extenso)}) quotas no valor nominal de R$ ${_(d.cap_valor_quota)} (${_(d.cap_valor_quota_extenso)}) cada, totalmente subscrito e integralizado neste ato, em moeda corrente nacional, distribuído da seguinte forma:`)}
${p(`${b(_(d.s1_nome))} – ${_(d.s1_quotas)} quotas – R$ ${_(d.s1_valor)} – ${_(d.s1_percentual)}%`)}
${p(`${b(_(d.s2_nome))} – ${_(d.s2_quotas)} quotas – R$ ${_(d.s2_valor)} – ${_(d.s2_percentual)}%`)}
${p("A responsabilidade de cada sócia é restrita ao valor de suas quotas, mas todas respondem solidariamente pela integralização do capital social.")}

${sec("CLÁUSULA 4ª – DA ADMINISTRAÇÃO")}
${p(`A administração da sociedade será exercida por ${b(_(d.adm_nome))}, que representará a sociedade ativa e passivamente, judicial e extrajudicialmente, podendo praticar todos os atos necessários ao cumprimento do objeto social.`)}
${p("Na hipótese de falecimento ou incapacidade da administradora, a administração será exercida pela sócia remanescente ou por terceiro de sua indicação exclusiva, vedada a interferência de qualquer representante ou procurador constituído pela sócia falecida ou incapaz.")}
${p("É vedado à administradora utilizar a sociedade para fins estranhos ao objeto social.")}

${sec("CLÁUSULA 5ª – DO PRÓ-LABORE")}
${p("A administradora poderá retirar pró-labore em valor fixado de comum acordo entre as sócias, observada a legislação vigente.")}

${sec("CLÁUSULA 6ª – DO ENQUADRAMENTO DE MICROEMPRESA")}
${p(`Os sócios declaram que o movimento da receita bruta anual da empresa não excederá o limite fixado no ${enqTexto}, e que não se enquadra(m) em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.`)}

${sec("CLÁUSULA 7ª – DO EXERCÍCIO SOCIAL")}
${p("O exercício social encerra-se em 31 de dezembro de cada ano, quando serão levantadas as demonstrações financeiras.")}
${p("Os lucros apurados poderão ser distribuídos às sócias na proporção de suas quotas ou em proporção diversa, mediante deliberação unânime.")}

${sec("CLÁUSULA 8ª – DA CESSÃO DE QUOTAS")}
${p("A cessão ou transferência de quotas dependerá do consentimento da outra sócia, que terá direito de preferência em igualdade de condições.")}
${p("É vedado o ingresso de terceiros no quadro societário sem expressa anuência da sócia remanescente.")}

${sec("CLÁUSULA 9ª – DA INCOMUNICABILIDADE")}
${p("As quotas sociais não se comunicarão com o cônjuge ou companheiro das sócias, independentemente do regime de bens, permanecendo de propriedade exclusiva da respectiva titular.")}

${sec("CLÁUSULA 10ª – DA RETIRADA IMOTIVADA")}
${p(`Qualquer sócia poderá retirar-se da sociedade mediante notificação escrita com antecedência mínima de ${_(d.ret_prazo_dias)} dias.`)}
${p("A retirada não implicará dissolução da sociedade.")}

${sec("CLÁUSULA 11ª – DA APURAÇÃO DE HAVERES")}
${p("Nos casos de retirada, exclusão, falecimento ou dissolução parcial, os haveres da sócia serão apurados com base em balanço patrimonial especialmente levantado na data do evento, considerando-se o valor contábil do patrimônio líquido.")}
${p(`O pagamento poderá ser efetuado em até ${_(d.hav_parcelas)} parcelas mensais e sucessivas, corrigidas pelo ${_(d.hav_indice)}.`)}

${sec("CLÁUSULA 12ª – DO FALECIMENTO")}
${p("O falecimento de qualquer sócia não implicará dissolução da sociedade, podendo a remanescente optar pela liquidação das quotas mediante apuração de haveres ou pela admissão dos herdeiros, mediante alteração contratual.")}

${sec("CLÁUSULA 13ª – DOS CREDORES PARTICULARES")}
${p("Na hipótese de constrição judicial de quotas por dívidas particulares de qualquer sócia, o credor limitar-se-á ao recebimento dos direitos econômicos eventualmente distribuídos, não lhe sendo assegurado direito de participação na administração da sociedade.")}

${sec("CLÁUSULA 14ª – DO FORO")}
${p(`Fica eleito o foro da Comarca de ${_(d.vig_foro)} para dirimir quaisquer controvérsias oriundas deste contrato.`)}

${p("E por estarem assim justas e contratadas, assinam o presente instrumento.")}

${p(_(d.vig_local_data))}

<div style="margin-top:40pt;display:flex;justify-content:space-between;gap:40pt;">
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.s1_nome)}</b>
  </div>
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.s2_nome)}</b>
  </div>
</div>`;
}

function exportDOCXSocial(d) {
  const html = buildContractHTMLSocial(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Contrato_Social_${(d.emp_denominacao || "Empresa").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFSocial(d) {
  const html = buildContractHTMLSocial(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   EXPORT — CONTRATO SOCIAL CABELEIREIRO
   ════════════════════════════════════════════ */
function buildContractHTMLCabeleireiro(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  const enqTexto = d.ne_porte === "EPP" ? "inciso II" : "inciso I";
  const porteTxt = d.ne_porte === "MEI" ? "Microempreendedor Individual" : d.ne_porte === "EPP" ? "Empresa de Pequeno Porte" : "Microempresa";

  const tabelaQuotas = `<table style="width:100%;border-collapse:collapse;margin:8pt 0;">
<tr style="background:#1a365d;color:#fff;">
  <th style="padding:6pt;border:1pt solid #ccc;text-align:left;">Sócio</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Quotas</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Valor unitário(R$)</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Total (R$)</th>
</tr>
<tr>
  <td style="padding:4pt;border:1pt solid #ccc;">${_(d.sc_nome).toUpperCase()}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_quotas_socio)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor_quota)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_total)}</td>
</tr>
<tr style="font-weight:700;">
  <td style="padding:4pt;border:1pt solid #ccc;">Total</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_quotas_socio)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor_quota)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_total)}</td>
</tr>
</table>`;

  return `
<h1 style="font-size:14pt;text-align:center;margin-bottom:4pt;font-weight:700;">CONTRATO SOCIAL</h1>
<h2 style="font-size:12pt;text-align:center;margin-bottom:4pt;font-weight:700;color:#1a365d;">POR TRANSFORMAÇÃO DE EMPRESÁRIO ${_(d.eo_razao).toUpperCase()}</h2>
<p style="text-align:center;margin-bottom:16pt;font-weight:600;">CNPJ ${_(d.eo_cnpj)}</p>

${p(`${b(_(d.sc_nome).toUpperCase())}, ${_(d.sc_nacionalidade)}, ${_(d.sc_estado_civil)}, ${_(d.sc_profissao)}, nascido em ${_(d.sc_nascimento)}, com documento de identidade nº ${_(d.sc_rg)}, ${_(d.sc_rg_orgao)}, CPF nº ${_(d.sc_cpf)}, residente e domiciliado na ${_(d.sc_endereco)}, CEP ${_(d.sc_cep)}. Empresário Individual, com sede na ${_(d.eo_sede)}, CEP ${_(d.eo_cep_sede)}, inscrito na Junta Comercial do Estado de Minas Gerais sob o NIRE ${_(d.eo_nire)}, razão social ${_(d.eo_razao)} em ${_(d.eo_data_registro)} e no CNPJ sob o nº ${_(d.eo_cnpj)}, fazendo uso do que permite o § 3º do art. 968 da Lei nº 10.406/2002, com a redação alterada pelo art. 10 da Lei Complementar nº 128/2008, ora transforma seu registro de EMPRESÁRIO em SOCIEDADE EMPRESÁRIA, passando a constituir o tipo jurídico SOCIEDADE EMPRESARIA LIMITADA, a qual se regerá.`)}

${p("Neste mesmo ato informa-se o valor do capital social da empresa com a distribuição das quotas citadas, objeto social, nome empresarial, endereço e Enquadramento quanto ao Porte, doravante, pelo presente a qual se regerá;")}

${sec("CLÁUSULA PRIMEIRA")}
${p(`A razão Social passa a ser ${b(_(d.ne_razao))}.`)}

${sec("CLÁUSULA SEGUNDA")}
${p(`O Capital Social é de R$ ${_(d.cap_total)}(${_(d.cap_total_extenso)}), divididos em ${_(d.cap_num_quotas)} (${_(d.cap_num_quotas_extenso)}) quotas no valor de R$ ${_(d.cap_valor_quota)}(${_(d.cap_valor_quota_extenso)}) cada, com a seguinte distribuição:`)}
${tabelaQuotas}

${sec("CLÁUSULA TERCEIRA")}
${p(`O objeto social é ${_(d.ne_objeto)}.`)}

${sec("CLÁUSULA QUARTA")}
${p(`O Porte da Empresa é ${porteTxt}, o signatário do presente ato declara que o movimento da receita bruta anual da empresa não excederá o limite fixado no ${enqTexto} do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006, e que não se enquadra em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.`)}

<div style="margin-top:30pt;border-top:2pt solid #1a365d;padding-top:16pt;">
<h1 style="font-size:14pt;text-align:center;margin-bottom:4pt;font-weight:700;">Consolidação do Contrato Social</h1>
<h2 style="font-size:12pt;text-align:center;margin-bottom:4pt;font-weight:700;color:#1a365d;">${_(d.ne_razao)}</h2>
<p style="text-align:center;margin-bottom:16pt;font-weight:600;">CNPJ ${_(d.eo_cnpj)}</p>
</div>

${p(`${b(_(d.sc_nome).toUpperCase())}, ${_(d.sc_nacionalidade)}, ${_(d.sc_estado_civil)}, ${_(d.sc_profissao)}, nascido em ${_(d.sc_nascimento)}, com documento de identidade nº ${_(d.sc_rg)}, ${_(d.sc_rg_orgao)}, CPF nº ${_(d.sc_cpf)}, residente e domiciliado na ${_(d.sc_endereco)}, CEP ${_(d.sc_cep)}, sócio da sociedade empresária limitada, inscrita no CNPJ sob o nº ${_(d.eo_cnpj)}, consolida neste ato seu Contrato Social, mediante as seguintes cláusulas:`)}

${sec("CLÁUSULA PRIMEIRA")}
${p(`A sociedade girará sob o nome empresarial de ${b(_(d.ne_razao))}, com sede na ${_(d.ne_sede)}, CEP ${_(d.ne_cep_sede)}.`)}

${sec("CLÁUSULA SEGUNDA")}
${p(`O objeto social é ${_(d.ne_objeto)}.`)}

${sec("CLÁUSULA TERCEIRA")}
${p(`O Capital Social é de R$ ${_(d.cap_total)}(${_(d.cap_total_extenso)}), divididos em ${_(d.cap_num_quotas)} (${_(d.cap_num_quotas_extenso)}) quotas no valor de R$ ${_(d.cap_valor_quota)}(${_(d.cap_valor_quota_extenso)}) cada, com a seguinte distribuição:`)}
${tabelaQuotas}

${sec("CLÁUSULA QUARTA")}
${p("A responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social, conforme art. 1.052 CC/2002.")}

${sec("CLÁUSULA QUINTA")}
${p(`A administração da sociedade será exercida pelo sócio ${b(_(d.adm_nome).toUpperCase())}, respondendo pela empresa, judicial e extrajudicialmente, em juízo ou fora dele, em conjunto ou individual, podendo praticar todos os atos compreendidos no objeto social, sempre no interesse da sociedade, ficando vedado o uso da denominação social em negócios estranhos aos fins sociais, bem como onerar bens imóveis da sociedade, sem autorização do outro sócio.`)}

${sec("CLÁUSULA SEXTA")}
${p(`A atividade iniciou em ${_(d.vig_data_inicio)} e o prazo de duração da sociedade será por tempo indeterminado. O porte da empresa é ${porteTxt}.`)}
${p(`O signatário do presente ato declara que o movimento da receita bruta anual da empresa não excederá o limite fixado no ${enqTexto} do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006, e que não se enquadra em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.`)}

${sec("CLÁUSULA SÉTIMA")}
${p("As quotas são indivisíveis e não poderão ser cedidas ou transferidas no todo ou em parte a terceiros, sem expresso consentimento do outro sócio, a quem fica assegurado, em igualdade de condições e preço, direito de preferência para a sua aquisição, formalizando, se realizada a cessão delas, a alteração contratual pertinente.")}

${sec("CLÁUSULA OITAVA")}
${p("Que a empresa poderá a qualquer tempo, abrir ou fechar filiais, em qualquer parte do país, se assim, em conjunto, decidirem os sócios em conjunto, mediante alteração contratual assinada por todos os sócios.")}

${sec("CLÁUSULA NONA")}
${p("Que o exercício social coincidirá com o ano civil. Ao término de cada exercício, o administrador prestará contas justificadas de sua administração, procedendo à elaboração das demonstrações financeiras, cabendo aos sócios, na proporção de suas quotas, os lucros ou perdas apurados.")}

${sec("CLÁUSULA DÉCIMA")}
${p("Em caso de morte de um dos sócios, a sociedade não será dissolvida e continuará sendo gerida pelo sócio remanescente ou pelos herdeiros. Não sendo possível ou inexistindo interesse destes ou do sócio remanescente, os valores de seus haveres serão apurados e liquidados com base na situação patrimonial da empresa. O mesmo procedimento será adotado em qualquer dos casos em que a sociedade se resolva em relação a um dos sócios.")}

${sec("CLÁUSULA DÉCIMA PRIMEIRA")}
${p("Pode o sócio ser excluído, quando a maioria dos sócios, representativa de mais da metade do capital social, entender que um ou mais sócios estão pondo em risco a continuidade da empresa, em virtude de atos graves e que configurem justa causa segundo artigo 1.085 do CC/2002.")}

${sec("CLÁUSULA DÉCIMA SEGUNDA")}
${p("Que os administradores declaram, sob as penas da lei, que não estão incursos em quaisquer crimes previstos em lei ou restrições legais, que possam impedi-los de exercer atividade empresarial conforme artigo 1.011, 1º do CC/2002.")}

${sec("CLÁUSULA DÉCIMA TERCEIRA")}
${p(`As partes elegem o foro de ${_(d.vig_foro)} para dirimir quaisquer dúvidas decorrente do presente instrumento contratual, bem como para o exercício e cumprimento dos direitos e obrigações resultantes deste contrato, sendo que os administradores renunciam a qualquer outro, por mais privilegiado que possa ser.`)}

${p("E, por estarem justos e contratados, assinam o presente instrumento particular digitalmente.")}

${p(_(d.vig_local_data))}

<div style="margin-top:40pt;">
  <div style="width:50%;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.sc_nome).toUpperCase()}</b><br/>
    Sócio Administrador
  </div>
</div>`;
}

function exportDOCXCabeleireiro(d) {
  const html = buildContractHTMLCabeleireiro(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}table{border-collapse:collapse;}td,th{padding:4pt;border:1pt solid #ccc;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Contrato_Social_${(d.ne_razao || "Cabeleireiro").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFCabeleireiro(d) {
  const html = buildContractHTMLCabeleireiro(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}table{border-collapse:collapse;width:100%;}td,th{padding:4pt;border:1pt solid #ccc;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   EXPORT — ALTERAÇÃO CONTRATUAL INATIVIDADE
   ════════════════════════════════════════════ */
function buildContractHTMLInatividade(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  const tabelaQuotas = `<table style="width:100%;border-collapse:collapse;margin:8pt 0;">
<tr style="background:#1a365d;color:#fff;">
  <th style="padding:6pt;border:1pt solid #ccc;text-align:left;">Sócio</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Quota</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Valor (R$)</th>
  <th style="padding:6pt;border:1pt solid #ccc;">%</th>
</tr>
<tr>
  <td style="padding:4pt;border:1pt solid #ccc;">${_(d.sc_nome).toUpperCase()}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_num_quotas)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">100</td>
</tr>
<tr style="font-weight:700;">
  <td style="padding:4pt;border:1pt solid #ccc;">Total</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_num_quotas)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">100</td>
</tr>
</table>`;

  return `
<h1 style="font-size:14pt;text-align:center;margin-bottom:4pt;font-weight:700;">${_(d.alt_numero)}ª ALTERAÇÃO CONTRATUAL</h1>
<p style="text-align:center;font-weight:700;margin:2pt 0;">${_(d.emp_razao)}</p>
<p style="text-align:center;margin:2pt 0;">CNPJ: ${_(d.emp_cnpj)}</p>
<p style="text-align:center;margin:2pt 0 16pt;">NIRE: ${_(d.emp_nire)}</p>

${p(`${b(_(d.emp_razao))}, inscrita no CNPJ: ${_(d.emp_cnpj)}, sociedade empresaria limitada, devidamente registrada na JUCEMG sob o n° ${_(d.emp_nire)} em ${_(d.emp_data_registro)}, estabelecida na ${_(d.emp_endereco)}, Cep ${_(d.emp_cep)}, sendo sócia, ${b(_(d.sc_nome).toUpperCase())}, ${_(d.sc_nacionalidade)}, ${_(d.sc_estado_civil)}, ${_(d.sc_profissao)}, nascida em ${_(d.sc_nascimento)}, com documento de identidade ${_(d.sc_rg)}, ${_(d.sc_rg_orgao)}, CPF nº ${_(d.sc_cpf)}, residente e domiciliada na ${_(d.sc_endereco_residencial)}, Cep ${_(d.sc_cep_residencial)}, resolve proceder a presente alteração contratual consolidando as cláusulas do contrato social mediante condições e cláusulas a seguir:`)}

${sec("PRIMEIRA")}
${p(`Oportunamente a sociedade empresária limitada, comunica à Junta Comercial do Estado de Minas Gerais a paralisação temporária de suas atividades pelo prazo de até ${_(d.inat_prazo_anos)} anos, a partir de ${_(d.inat_data_inicio)}.`)}

<div style="margin-top:30pt;border-top:2pt solid #1a365d;padding-top:16pt;">
<h1 style="font-size:14pt;text-align:center;margin-bottom:4pt;font-weight:700;">CONSOLIDAÇÃO DOS ATOS CONSTITUTIVOS</h1>
<p style="text-align:center;font-weight:700;margin:2pt 0;">${_(d.emp_razao)}</p>
<p style="text-align:center;margin:2pt 0;">CNPJ: ${_(d.emp_cnpj)}</p>
<p style="text-align:center;margin:2pt 0 16pt;">NIRE: ${_(d.emp_nire)}</p>
</div>

${p(`A sociedade gira sob a denominação social de ${b(_(d.emp_razao))}, inscrita no CNPJ: ${_(d.emp_cnpj)}, sociedade empresaria limitada, devidamente registrada na JUCEMG sob o n° ${_(d.emp_nire)} em ${_(d.emp_data_registro)}, estabelecida na ${_(d.emp_endereco)}, Cep ${_(d.emp_cep)}, sendo sócia, ${b(_(d.sc_nome).toUpperCase())}, ${_(d.sc_nacionalidade)}, ${_(d.sc_estado_civil)}, ${_(d.sc_profissao)}, nascida em ${_(d.sc_nascimento)}, com documento de identidade ${_(d.sc_rg)}, ${_(d.sc_rg_orgao)}, CPF nº ${_(d.sc_cpf)}, residente e domiciliada na ${_(d.sc_endereco_residencial)}, Cep ${_(d.sc_cep_residencial)}, temporariamente paralisada pelo período de até ${_(d.inat_prazo_anos)} anos, com início em ${_(d.inat_data_inicio)}.`)}

${sec("CLÁUSULA PRIMEIRA")}
${p(`A sede da empresa estabelecida na ${_(d.emp_endereco)}, CEP ${_(d.emp_cep)}.`)}

${sec("CLÁUSULA SEGUNDA")}
${p(`O objeto social é ${_(d.emp_objeto)}.`)}

${sec("CLÁUSULA TERCEIRA")}
${p(`O capital social é no valor de R$ ${_(d.cap_valor)} (${_(d.cap_valor_extenso)}), divididos em ${_(d.cap_num_quotas)} (${_(d.cap_num_quotas_extenso)}) quotas no valor nominal de R$ ${_(d.cap_valor_quota)} (${_(d.cap_valor_quota_extenso)}) cada uma, integralizadas em moeda corrente neste ato pelo sócio e distribuindo-se da seguinte forma:`)}
${tabelaQuotas}

${sec("CLÁUSULA QUARTA")}
${p("A responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social, conforme art. 1.052 CC/2002.")}

${sec("CLÁUSULA QUINTA")}
${p(`A administração da sociedade será exercida pelo sócio; ${b(_(d.sc_nome).toUpperCase())}, respondendo pela empresa, judicial e extrajudicialmente, em juízo ou fora dele, em conjunto ou individual, podendo praticar todos os atos compreendidos no objeto social, sempre no interesse da sociedade, ficando vedado o uso da denominação social em negócios estranhos aos fins sociais, bem como onerar bens imóveis da sociedade, sem autorização do outro sócio.`)}

${sec("CLÁUSULA SEXTA")}
${p(`As atividades iniciaram em ${_(d.emp_data_inicio_atividades)} e o prazo de duração da sociedade será por tempo indeterminado.`)}

${sec("CLÁUSULA SÉTIMA")}
${p("As quotas são indivisíveis e não poderão ser cedidas ou transferidas no todo ou em parte a terceiros, sem expresso consentimento do outro sócio, a quem fica assegurado, em igualdade de condições e preço, direito de preferência para a sua aquisição, formalizando, se realizada a cessão delas, a alteração contratual pertinente.")}

${sec("CLÁUSULA OITAVA")}
${p("Que a empresa poderá a qualquer tempo, abrir ou fechar filiais, em qualquer parte do país, se assim, em conjunto, decidirem os sócios em conjunto, mediante alteração contratual assinada por todos os sócios.")}

${sec("CLÁUSULA NONA")}
${p("Que o exercício social coincidirá com o ano civil. Ao término de cada exercício, o administrador prestará contas justificadas de sua administração, procedendo à elaboração das demonstrações financeiras, cabendo aos sócios, na proporção de suas quotas, os lucros ou perdas apurados.")}

${sec("CLÁUSULA DÉCIMA")}
${p("Em caso de morte de um dos sócios, a sociedade não será dissolvida e continuará sendo gerida pelo sócio remanescente ou pelos herdeiros. Não sendo possível ou inexistindo interesse destes ou do sócio remanescente, os valores de seus haveres serão apurados e liquidados com base na situação patrimonial da empresa. O mesmo procedimento será adotado em qualquer dos casos em que a sociedade se resolva em relação a um dos sócios.")}

${sec("CLÁUSULA DÉCIMA PRIMEIRA")}
${p("Pode o sócio ser excluído, quando a maioria dos sócios, representativa de mais da metade do capital social, entender que um ou mais sócios estão pondo em risco a continuidade da empresa, em virtude de atos graves e que configurem justa causa segundo artigo 1.085 do CC/2002.")}

${sec("CLÁUSULA DÉCIMA SEGUNDA")}
${p("Que os administradores declaram, sob as penas da lei, que não estão incursos em quaisquer crimes previstos em lei ou restrições legais, que possam impedi-los de exercer atividade empresarial conforme artigo 1.011, 1º do CC/2002.")}

${sec("CLÁUSULA DÉCIMA TERCEIRA")}
${p(`As partes elegem o foro de ${_(d.vig_foro)} para dirimir quaisquer dúvidas decorrente do presente instrumento contratual, bem como para o exercício e cumprimento dos direitos e obrigações resultantes deste contrato, sendo que os administradores renunciam a qualquer outro, por mais privilegiado que possa ser.`)}

${p("E, por estarem justos e contratados, assinam digitalmente o presente instrumento particular em uma via.")}

${p(_(d.vig_local_data))}

<div style="margin-top:40pt;">
  <div style="width:50%;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.sc_nome).toUpperCase()}</b><br/>
    SOCIA ADMINISTRADORA
  </div>
</div>`;
}

function exportDOCXInatividade(d) {
  const html = buildContractHTMLInatividade(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}table{border-collapse:collapse;}td,th{padding:4pt;border:1pt solid #ccc;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Alteracao_Contratual_Inatividade_${(d.emp_razao || "Empresa").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFInatividade(d) {
  const html = buildContractHTMLInatividade(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}table{border-collapse:collapse;width:100%;}td,th{padding:4pt;border:1pt solid #ccc;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   EXPORT — ALTERAÇÃO CONTRATUAL (CESSÃO DE QUOTAS)
   ════════════════════════════════════════════ */
function buildContractHTMLAlteracao(d) {
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  const enqTexto = d.enq_porte === "EPP" ? "inciso II" : "inciso I";
  const porteTxt = d.enq_porte === "EPP" ? "EPP" : "ME";

  const tabelaQuotas = `<table style="width:100%;border-collapse:collapse;margin:8pt 0;">
<tr style="background:#1a365d;color:#fff;">
  <th style="padding:6pt;border:1pt solid #ccc;text-align:left;">Sócio</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Quotas</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Valor Nominal (R$)</th>
  <th style="padding:6pt;border:1pt solid #ccc;">Total (R$)</th>
  <th style="padding:6pt;border:1pt solid #ccc;">%</th>
</tr>
<tr>
  <td style="padding:4pt;border:1pt solid #ccc;">${_(d.sc1_nome).toUpperCase()}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.dist_sc1_quotas)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor_quota)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.dist_sc1_total)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.dist_sc1_percentual)}</td>
</tr>
<tr>
  <td style="padding:4pt;border:1pt solid #ccc;">${_(d.sc2_nome).toUpperCase()}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.dist_sc2_quotas)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor_quota)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.dist_sc2_total)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.dist_sc2_percentual)}</td>
</tr>
<tr style="font-weight:700;">
  <td style="padding:4pt;border:1pt solid #ccc;">Total</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_num_quotas)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor_quota)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">${_(d.cap_valor)}</td>
  <td style="padding:4pt;border:1pt solid #ccc;text-align:center;">100</td>
</tr>
</table>`;

  return `
<h1 style="font-size:14pt;text-align:center;margin-bottom:4pt;font-weight:700;">${_(d.alt_numero)}ª ALTERAÇÃO CONTRATUAL</h1>
<p style="text-align:center;font-weight:700;margin:2pt 0;">${_(d.emp_razao)}</p>
<p style="text-align:center;margin:2pt 0;">CNPJ Nº ${_(d.emp_cnpj)}</p>
<p style="text-align:center;margin:2pt 0 16pt;">NIRE Nº ${_(d.emp_nire)} em ${_(d.emp_data_registro)}</p>

${p(`${b(_(d.sc1_nome).toUpperCase())}, ${_(d.sc1_nacionalidade)}, ${_(d.sc1_estado_civil)}, ${_(d.sc1_profissao)}, nascido em ${_(d.sc1_nascimento)}, portador do CPF n°. ${_(d.sc1_cpf)} e documento de identidade n°. ${_(d.sc1_rg)}, ${_(d.sc1_rg_orgao)}, com residência a ${_(d.sc1_endereco)}, CEP: ${_(d.sc1_cep)};`)}

${p(`${b(_(d.sc2_nome).toUpperCase())}, ${_(d.sc2_nacionalidade)}, ${_(d.sc2_estado_civil)}, ${_(d.sc2_profissao)}, nascida em ${_(d.sc2_nascimento)}, documento de identidade nº ${_(d.sc2_rg)}, ${_(d.sc2_rg_orgao)} e do CPF nº ${_(d.sc2_cpf)}, residente na ${_(d.sc2_endereco)}, CEP: ${_(d.sc2_cep)}, únicos sócios da sociedade empresaria limitada, denominada, ${b(_(d.emp_razao))}, inscrita no CNPJ sob o nº ${_(d.emp_cnpj)} e registrada na Junta Comercial do Estado de Minas Gerais sob o NIRE nº ${_(d.emp_nire)} em ${_(d.emp_data_registro)}, com sede na ${_(d.emp_endereco)}, CEP: ${_(d.emp_cep)}, resolvem alterar e consolidar o contrato social, conforme clausulas e condições a seguir:`)}

${sec("CLAUSULA PRIMEIRA")}
${p(`A sócia ${b(_(d.ces_cedente).toUpperCase())}, já qualificada acima, cede e transfere ${_(d.ces_percentual)} (${_(d.ces_percentual_extenso)}) de suas quotas para o sócio ${b(_(d.ces_cessionario).toUpperCase())}, já qualificado acima, ficando distribuído da seguinte forma:`)}

${p(`${b(_(d.sc1_nome).toUpperCase())}, passa a possuir ${_(d.dist_sc1_quotas)}(${_(d.dist_sc1_quotas_extenso)}) quotas no valor nominal de R$${_(d.cap_valor_quota)}(${_(d.cap_valor_quota_extenso)}) cada, totalizando R$${_(d.dist_sc1_total)}(${_(d.dist_sc1_total_extenso)}), que corresponde a ${_(d.dist_sc1_percentual)}% do capital social, já integralizado em moeda corrente do país.`)}

${p(`${b(_(d.sc2_nome).toUpperCase())}, passa a possuir ${_(d.dist_sc2_quotas)}(${_(d.dist_sc2_quotas_extenso)}) quotas no valor nominal de R$${_(d.cap_valor_quota)}(${_(d.cap_valor_quota_extenso)}) cada, totalizando R$${_(d.dist_sc2_total)}(${_(d.dist_sc2_total_extenso)}), que corresponde a ${_(d.dist_sc2_percentual)}% do capital social, já integralizado em moeda corrente do país.`)}

<div style="margin-top:30pt;border-top:2pt solid #1a365d;padding-top:16pt;">
<h1 style="font-size:14pt;text-align:center;margin-bottom:4pt;font-weight:700;">CONSOLIDAÇÃO DOS ATOS CONSTITUTIVOS</h1>
<p style="text-align:center;font-weight:700;margin:2pt 0;">${_(d.emp_razao)}</p>
<p style="text-align:center;margin:2pt 0;">CNPJ Nº ${_(d.emp_cnpj)}</p>
<p style="text-align:center;margin:2pt 0 16pt;">NIRE Nº ${_(d.emp_nire)} EM ${_(d.emp_data_registro)}</p>
</div>

${p(`${b(_(d.sc1_nome).toUpperCase())}, ${_(d.sc1_nacionalidade)}, ${_(d.sc1_profissao)}, ${_(d.sc1_estado_civil)}, nascido em ${_(d.sc1_nascimento)}, portador do CPF n°. ${_(d.sc1_cpf)} e documento de identidade n°. ${_(d.sc1_rg)}, ${_(d.sc1_rg_orgao)}, com residência a ${_(d.sc1_endereco)}, CEP: ${_(d.sc1_cep)};`)}

${p(`${b(_(d.sc2_nome).toUpperCase())}, ${_(d.sc2_nacionalidade)}, ${_(d.sc2_estado_civil)}, ${_(d.sc2_profissao)}, nascida em ${_(d.sc2_nascimento)}, documento de identidade nº ${_(d.sc2_rg)}, ${_(d.sc2_rg_orgao)} e do CPF nº ${_(d.sc2_cpf)}, residente na ${_(d.sc2_endereco)}, CEP: ${_(d.sc2_cep)}, únicos sócios da sociedade empresaria limitada, denominada, ${b(_(d.emp_razao))}, inscrita no CNPJ sob o nº ${_(d.emp_cnpj)} e registrada na Junta Comercial do Estado de Minas Gerais sob o NIRE nº ${_(d.emp_nire)} em ${_(d.emp_data_registro)}, com sede na ${_(d.emp_endereco)}, CEP: ${_(d.emp_cep)}, consolidam o contrato social, conforme clausulas e condições a seguir:`)}

${sec("CLAUSULA PRIMEIRA")}
${p(`A sociedade empresária limitada, tem prazo de duração por tempo indeterminado e adota o nome empresarial de ${b(_(d.emp_razao))} e nome fantasia: ${b(_(d.emp_nome_fantasia))}.`)}

${sec("CLAUSULA SEGUNDA")}
${p(`Sede na ${_(d.emp_endereco)}, CEP: ${_(d.emp_cep)}.`)}

${sec("CLÁUSULA TERCEIRA")}
${p(`O objeto social é ${_(d.emp_objeto)}.`)}

${sec("CLÁUSULA QUARTA")}
${p(`O Capital Social desta sociedade será no valor de R$ ${_(d.cap_valor)} (${_(d.cap_valor_extenso)}), dividido em ${_(d.cap_num_quotas)} (${_(d.cap_num_quotas_extenso)}) quotas no valor de R$ ${_(d.cap_valor_quota)} (${_(d.cap_valor_quota_extenso)}) cada uma, totalizando R$ ${_(d.cap_valor)} (${_(d.cap_valor_extenso)}) em moeda corrente do País e distribuído da seguinte forma:`)}

${p(`${b(_(d.sc1_nome).toUpperCase())}, possuidor de ${_(d.dist_sc1_quotas)}(${_(d.dist_sc1_quotas_extenso)}) quotas no valor nominal de R$${_(d.cap_valor_quota)}(${_(d.cap_valor_quota_extenso)}) cada, totalizando R$${_(d.dist_sc1_total)}(${_(d.dist_sc1_total_extenso)}), que corresponde a ${_(d.dist_sc1_percentual)}% do capital social, já integralizado em moeda corrente do país.`)}

${p(`${b(_(d.sc2_nome).toUpperCase())}, possuidora de ${_(d.dist_sc2_quotas)}(${_(d.dist_sc2_quotas_extenso)}) quotas no valor nominal de R$${_(d.cap_valor_quota)}(${_(d.cap_valor_quota_extenso)}) cada, totalizando R$${_(d.dist_sc2_total)}(${_(d.dist_sc2_total_extenso)}), que corresponde a ${_(d.dist_sc2_percentual)}% do capital social, já integralizado em moeda corrente do país.`)}

${sec("CLÁUSULA QUINTA")}
${p(`A administração da sociedade caberá ao sócio, ${b(_(d.adm_nome).toUpperCase())}, já qualificado acima, onde assinará isoladamente, com os poderes e atribuições de representação ativa e passiva, judicial e extrajudicial, podendo praticar todos os atos compreendidos no objeto.`)}

${sec("CLÁUSULA SEXTA")}
${p("Ao término de cada exercício social, em 31 de dezembro, proceder-se-á a elaboração do inventário, do balanço patrimonial e do balanço de resultado econômico.")}
${p("<b>Parágrafo único</b> – Poderão os sócios durante o decorrer do exercício social, levantar balanços e/ou balancetes parciais e seus resultados tratando-se de lucros e/ou perdas, poderão ser distribuídas as sócias, proporcionalmente às suas quotas ou de forma convencionada entre elas.")}

${sec("CLÁUSULA SÉTIMA")}
${p("A sociedade poderá a qualquer tempo, abrir ou fechar filial ou outra dependência, mediante ato de alteração do ato constitutivo.")}

${sec("CLÁUSULA OITAVA")}
${p("Os sócios declaram, sob as penas da lei, de que não estão impedidos de exercerem a administração da sociedade, por lei especial, ou em virtude de condenação criminal, ou por se encontrarem sob os efeitos dela, a pena que vede, ainda que temporariamente, o acesso a cargos públicos; ou por crime falimentar, de prevaricação, peita ou suborno, concussão, peculato, ou contra a economia popular, contra o sistema financeiro nacional, contra normas de defesa da concorrência, contra as relações de consumo, fé pública, ou a propriedade.")}

${sec("CLÁUSULA NONA")}
${p("A sociedade não se dissolverá por morte ou retirada de qualquer dos sócios, podendo continuar com os sucessores ou herdeiros do sócio retirante ou falecido, devendo ser levantado balanço especial na ocasião e verificado o crédito e ser assentada a participação dos sucessores ou herdeiros na sociedade.")}

${sec("CLÁUSULA DÉCIMA")}
${p("Os sócios que desejarem retirar-se da sociedade deverá comunicar ao outro por escrito e decorrido o prazo de 30 (trinta) dias, após a comunicação seus, haveres serão apurados e pagos de acordo com o estabelecido na ocasião.")}

${sec("CLÁUSULA DÉCIMA PRIMEIRA")}
${p("Nenhum dos sócios poderá ceder ou transferir suas quotas de capital a terceiros no todo ou em partes, sem o consentimento do outro sócio, cabendo-lhes a este o direito de preferência para a aquisição em igualdade de condições.")}

${sec("CLÁUSULA DÉCIMA SEGUNDA")}
${p("O Administrador declara, sob as penas da Lei, que não estar impedido de exercer a administração da sociedade, por Lei especial, ou em virtude de condenação criminal, ou por se encontrar sob os efeitos dela, a pena que vede ainda que temporariamente, o acesso a cargos públicos; ou por crime falimentar de prevaricação, peita ou suborno, concussão, peculato, ou contra a economia popular, contra o sistema financeiro nacional, contra normas de defesa de concorrência, contra as relações de consumo, fé pública ou a propriedade.")}

${sec("CLÁUSULA DÉCIMA TERCEIRA")}
${p(`Os signatários do presente ato declaram, sob as penas da lei que a empresa se enquadra na situação de ${porteTxt} e que o movimento da receita bruta anual da empresa não excederá o limite fixado no ${enqTexto} do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006, e que não se enquadram em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.`)}

${sec("CLÁUSULA DÉCIMA QUARTA")}
${p(`Fica eleito o foro da comarca de ${_(d.vig_foro)} para dirimir as dúvidas oriundas na interpretação do presente instrumento.`)}

${p("E, por assim estarem justos e contratados assinam digitalmente o presente Contrato Social.")}

${p(_(d.vig_local_data))}

<div style="margin-top:40pt;display:flex;justify-content:space-between;gap:30pt;">
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.sc1_nome).toUpperCase()}</b>
  </div>
  <div style="flex:1;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.sc2_nome).toUpperCase()}</b>
  </div>
</div>`;
}

function exportDOCXAlteracao(d) {
  const html = buildContractHTMLAlteracao(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}table{border-collapse:collapse;}td,th{padding:4pt;border:1pt solid #ccc;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Alteracao_Contratual_${(d.emp_razao || "Empresa").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFAlteracao(d) {
  const html = buildContractHTMLAlteracao(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}table{border-collapse:collapse;width:100%;}td,th{padding:4pt;border:1pt solid #ccc;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   EXPORT — TERMO DE DISTRATO
   ════════════════════════════════════════════ */
function buildContractHTMLDistrato(d) {
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  return `
<h1 style="font-size:14pt;text-align:center;margin-bottom:20pt;letter-spacing:0.5pt;font-weight:700;">TERMO DE DISTRATO</h1>

${p("As PARTES a seguir qualificadas:")}

${p(`${b(_(d.ct_razao))} (CONTRATANTE), pessoa jurídica inscrita no CNPJ sob o nº ${_(d.ct_cnpj)}, situada à ${_(d.ct_endereco)}, CEP ${_(d.ct_cep)}; e,`)}

${p(`${b(_(d.cd_razao))} (CONTRATADA), pessoa jurídica inscrita no CNPJ sob o nº ${_(d.cd_cnpj)}, situada à ${_(d.cd_endereco)}, CEP ${_(d.cd_cep)}.`)}

<h2 style="font-size:12pt;color:#1a365d;margin-top:20pt;font-weight:700;">CONSIDERANDO QUE:</h2>

${p(`Em ${_(d.orig_data_celebracao)}, Contratante e Contratado, celebraram Contrato nos termos da ${_(d.orig_lei)} (CONTRATO), por prazo indeterminado, cujo objeto é ${_(d.orig_objeto)};`)}

${p(`A relação de parceria entre ambas as pessoas jurídicas sempre se ateve às normas vigentes, em especial a ${_(d.orig_lei_nome)}.`)}

${p("Resolvem em um acordo, para não dar continuidade à relação de parceria vigente;")}

<h2 style="font-size:12pt;color:#1a365d;margin-top:20pt;font-weight:700;">RESOLVEM, em comum acordo, por meio deste Termo de Distrato:</h2>

${p(`Registrar o encerramento regular do Contrato de Parceria celebrado entre Contratante e Contratado, desde o dia ${_(d.dist_data_encerramento)}, sem que haja qualquer valor devido de parte a parte.`)}

${p("Registrar que durante todo o período de vigência do contrato, as normas legais e pactuadas entre as partes foram regularmente cumpridas.")}

${p("Registrar que todos os repasses financeiros devidos foram realizados.")}

${p("Registrar que todos os instrumentos de trabalho foram devolvidos.")}

<h2 style="font-size:12pt;color:#1a365d;margin-top:20pt;font-weight:700;">E assim, em face ao exposto DECLARAM as PARTES:</h2>

${p("I – Plenamente satisfeitas com o direito, as obrigações e os deveres do contrato de parceria, que ora rescindem, atestando o seu fiel cumprimento, para nada mais reclamar em juízo ou fora dele, a qualquer título, conferindo ambos plena, geral e irrestrita quitação e extinta a relação jurídica, inclusive quanto a eventuais danos materiais e morais, nada mais tendo a requerer a qualquer título e sob qualquer pretexto.")}

${p("E, por estarem assim justas e contratadas, assinam o presente Termo em 2 (duas) vias de igual teor e forma, e para um só efeito legal, na presença de 2 (duas) testemunhas.")}

${p(_(d.vig_local_data))}

<div style="margin-top:40pt;">
  <div style="border-top:1pt solid #333;padding-top:8pt;margin-bottom:24pt;width:70%;">
    <b>${_(d.ct_razao)}</b><br/>CNPJ: ${_(d.ct_cnpj)}
  </div>
  <div style="border-top:1pt solid #333;padding-top:8pt;margin-bottom:24pt;width:70%;">
    <b>${_(d.cd_razao)}</b><br/>CNPJ: ${_(d.cd_cnpj)}
  </div>
</div>

<p style="margin-top:30pt;font-weight:700;">TESTEMUNHAS:</p>
<div style="display:flex;gap:40pt;margin-top:20pt;">
  <div style="flex:1;border-top:1pt solid #333;padding-top:8pt;">
    Nome: ${_(d.test1_nome)}<br/>CPF: ${_(d.test1_cpf)}
  </div>
  <div style="flex:1;border-top:1pt solid #333;padding-top:8pt;">
    Nome: ${_(d.test2_nome)}<br/>CPF: ${_(d.test2_cpf)}
  </div>
</div>`;
}

function exportDOCXDistrato(d) {
  const html = buildContractHTMLDistrato(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Termo_Distrato_${(d.ct_razao || "Contratante").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFDistrato(d) {
  const html = buildContractHTMLDistrato(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

/* ════════════════════════════════════════════
   EXPORT — COMUNICAÇÃO DE PARALISAÇÃO
   ════════════════════════════════════════════ */
function buildContractHTMLParalisacao(d) {
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  return `
<h1 style="font-size:14pt;text-align:center;margin-bottom:6pt;font-weight:700;">COMUNICAÇÃO DE PARALISAÇÃO TEMPORÁRIA DE ATIVIDADES</h1>
<p style="text-align:center;font-size:12pt;font-weight:700;color:#1a365d;margin-bottom:24pt;">SOCIEDADE EMPRESÁRIA</p>

<p style="text-align:center;font-size:13pt;font-weight:700;margin-bottom:8pt;">${_(d.emp_razao)}</p>

${p(`${_(d.emp_endereco).toUpperCase()}, CEP: ${_(d.emp_cep)},`)}

${p(`NIRE Nº ${_(d.emp_nire)}, em ${_(d.emp_data_registro)} e CNPJ nº ${_(d.emp_cnpj)}, comunica à JUNTA COMERCIAL DO ESTADO DE MINAS GERAIS, que paralisará temporariamente, suas atividades, pelo prazo de até ${_(d.par_prazo_anos)}(${_(d.par_prazo_extenso)}) anos, com início em ${_(d.par_data_inicio)}.`)}

${p("Declara ainda, os seguintes dados:")}

${p(`a) O objeto da sociedade é ${_(d.emp_objeto)}.`)}

${p(`b) O capital da sociedade é de R$${_(d.cap_valor)}(${_(d.cap_valor_extenso)}), dividido em ${_(d.cap_num_quotas)} (${_(d.cap_num_quotas_extenso)}) quotas no valor de R$${_(d.cap_valor_quota)}(${_(d.cap_valor_quota_extenso)}) cada uma e distribuídas para o sócio, conforme indicação feita abaixo, no fecho desta COMUNICAÇÃO.`)}

${p(`c) A sociedade é administrada pela sócia, ${b(_(d.adm_nome).toUpperCase())}.`)}

${p(`d) A sociedade tem o prazo de duração indeterminado e início das atividades foi em ${_(d.emp_data_inicio_atividades)}.`)}

${d.fil_endereco ? p(`e) A sociedade tem filial no seguinte endereço: ${_(d.fil_endereco)}, CEP: ${_(d.fil_cep)}, registrada sob o NIRE nº ${_(d.fil_nire)} em ${_(d.fil_data_registro)}.`) : ""}

${p(`${d.fil_endereco ? "F" : "e"}) Dados dos sócios:`)}

${p(`${b(_(d.sc_nome))}, ${_(d.sc_nacionalidade)}, ${_(d.sc_estado_civil)}, ${_(d.sc_profissao)}, nascida em ${_(d.sc_nascimento)}, com documento de identidade ${_(d.sc_rg)}, ${_(d.sc_rg_orgao)}, CPF nº ${_(d.sc_cpf)}, residente e domiciliada na ${_(d.sc_endereco)}, Cep ${_(d.sc_cep)} e possuidora de ${_(d.sc_quotas)} (${_(d.sc_quotas_extenso)}), quotas no capital social.`)}

${p(_(d.vig_local_data))}

<div style="margin-top:40pt;">
  <div style="width:50%;text-align:center;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.sc_nome)}</b><br/>
    CPF: ${_(d.sc_cpf)}
  </div>
</div>

<p style="margin-top:50pt;font-size:9pt;color:#64748b;">Autenticação (para uso exclusivo da JUCEMG)</p>`;
}

function exportDOCXParalisacao(d) {
  const html = buildContractHTMLParalisacao(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Comunicacao_Paralisacao_${(d.emp_razao || "Empresa").replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFParalisacao(d) {
  const html = buildContractHTMLParalisacao(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

function buildContractHTMLAlteracaoEssencial(d) {
  const p = (text) => `<p style="text-align:justify;margin:6pt 0;line-height:1.7;">${text}</p>`;
  const sec = (title) => `<h2 style="font-size:13pt;color:#1a365d;border-bottom:1pt solid #2b6cb0;padding-bottom:4pt;margin-top:16pt;font-weight:700;">${title}</h2>`;
  const b = (text) => `<b>${text}</b>`;
  const _ = (val) => val || "________";

  return `
<p style="text-align:center;font-size:12pt;font-weight:700;margin-bottom:4pt;">${_(d.emp_razao_anterior)}</p>
<p style="text-align:center;font-size:11pt;margin-bottom:2pt;">CNPJ ${_(d.emp_cnpj)}</p>
<p style="text-align:center;font-size:11pt;margin-bottom:2pt;">NIRE ${_(d.emp_nire)}</p>
<p style="text-align:center;font-size:11pt;margin-bottom:20pt;">EM ${_(d.emp_data_registro)}</p>

<h1 style="font-size:14pt;text-align:center;margin-bottom:20pt;letter-spacing:0.5pt;font-weight:700;">TRANSFORMAÇÃO EM SOCIEDADE EMPRESARIA LIMITADA</h1>

${p(`${b(_(d.emp_razao_anterior))}, empresario individual, inscrita no CNPJ sob nº ${_(d.emp_cnpj)}, registro no Conselho Regional de Contabilidade sob nº ${_(d.emp_crc)}, estabelecida à ${_(d.emp_endereco)}, CEP ${_(d.emp_cep)}, representada pela unica sócia, ${_(d.sc_nome)}, ${_(d.sc_nacionalidade)}, ${_(d.sc_estado_civil)}, ${_(d.sc_profissao)}, nascida em ${_(d.sc_nascimento)}, natural de ${_(d.sc_naturalidade)}, portadora da Cédula de Identidade RG n° ${_(d.sc_rg)}, ${_(d.sc_rg_orgao)}, inscrita no CPF sob n° ${_(d.sc_cpf)}, inscrita no Conselho Regional de Contabilidade, sob nº ${_(d.sc_crc)}, residente à ${_(d.sc_endereco)}, registrada na Junta Comercial de Minas Gerais sob o NIRE nº ${_(d.emp_nire)} em ${_(d.emp_data_registro)} e alteração arquivada sob nº ${_(d.alt_numero)} em ${_(d.alt_data)}, resolve neste ato fazer a Transformação de empresario individual para Sociedade empresária limitada, regida por este Contrato Social, pelas disposições legais aplicáveis às sociedades limitadas na Lei Federal 10.406 de 10 de janeiro de 2002, conforme cláusulas a seguir:`)}

${sec("CAPÍTULO I — DENOMINAÇÃO, SEDE E OBJETO")}

${p(`${b("Cláusula 1.")} Transformação da empresario individual em uma Sociedade empresária Limitada.`)}

${p(`${b("Cláusula 2.")} Alteração sua razão social para ${b(_(d.emp_razao_nova))}, e mantem seu nome fantasia, ${b(_(d.emp_nome_fantasia))}.`)}

${p(`${b("Cláusula 3.")} A sociedade continua na sua sede e foro na ${_(d.emp_endereco)}, CEP. ${_(d.emp_cep).replace(/[.\-]/g, "").replace(/(\d{5})(\d{3})/, "$1-$2")}, e poderá abrir e encerrar filiais, em qualquer localidade do País.`)}

${p(`${b("Cláusula 4.")} O objeto social é ${_(d.emp_objeto)}.`)}

<div style="page-break-before:always;"></div>

<p style="text-align:center;font-size:12pt;font-weight:700;margin-bottom:4pt;margin-top:30pt;">ATOS CONSTITUTIVOS</p>

<p style="text-align:center;font-size:13pt;font-weight:700;margin-bottom:4pt;">${_(d.emp_razao_nova)}</p>
<p style="text-align:center;font-size:11pt;margin-bottom:2pt;">CNPJ ${_(d.emp_cnpj)}</p>
<p style="text-align:center;font-size:11pt;margin-bottom:2pt;">NIRE ${_(d.emp_nire)}</p>
<p style="text-align:center;font-size:11pt;margin-bottom:20pt;">EM ${_(d.emp_data_registro)}</p>

${p(_(d.atos_preambulo))}

${sec("CAPÍTULO I — DENOMINAÇÃO, SEDE, OBJETO E DURAÇÃO")}

${p(`${b("Cláusula 1.")} ${_(d.atos_cl1)}`)}

${p(`${b("Cláusula 2.")} ${_(d.atos_cl2)}`)}

${p(`${b("Cláusula 3.")} ${_(d.atos_cl3)}`)}

${p(`${b("Cláusula 4.")} ${_(d.atos_cl4)}`)}

${sec("CAPÍTULO II — CAPITAL SOCIAL")}

${p(`${b("Cláusula 5.")} ${_(d.atos_cl5)}`)}

${p(`${b("Cláusula 6.")} ${_(d.atos_cl6)}`)}

${sec("CAPÍTULO III — ADMINISTRAÇÃO E DECLARAÇÃO DO SÓCIO")}

${p(`${b("Cláusula 7.")} ${_(d.atos_cl7)}`)}

${p(`${b("Cláusula 8.")} ${_(d.atos_cl8)}`)}

${p(`${b("Cláusula 9.")} ${_(d.atos_cl9)}`)}

${p(`${b("Cláusula 10.")} ${_(d.atos_cl10)}`)}

${sec("CAPÍTULO IV — DAS DELIBERAÇÕES SOCIAIS")}

${p(`${b("Cláusula 11.")} ${_(d.atos_cl11)}`)}

${p(`${b("Cláusula 12.")} ${_(d.atos_cl12)}`)}

${p(`${b("Cláusula 13.")} ${_(d.atos_cl13)}`)}

${sec("CAPÍTULO V — DO EXERCÍCIO SOCIAL, BALANÇO E LUCROS")}

${p(`${b("Cláusula 14.")} ${_(d.atos_cl14)}`)}

${sec("CAPÍTULO VI — DA CONTINUIDADE DA SOCIEDADE")}

${p(`${b("Cláusula 15.")} ${_(d.atos_cl15)}`)}

${sec("CAPÍTULO VII — FORO")}

${p(`${b("Cláusula 16.")} ${_(d.atos_cl16)}`)}

${p("E assim, estando as Partes de comum acordo quanto ao contratado, dando-o por justo e acertado, assinam o presente Contrato digitalmente.")}

${p(_(d.vig_local_data))}

<div style="margin-top:40pt;text-align:center;">
  <div style="width:60%;margin:0 auto;border-top:1pt solid #333;padding-top:8pt;">
    <b>${_(d.emp_razao_nova)}</b><br/>
    ${_(d.sc_nome)}<br/>
    Sócia Administradora
  </div>
</div>`;
}

function exportDOCXAlteracaoEssencial(d) {
  const html = buildContractHTMLAlteracaoEssencial(d);
  const fullHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><style>body{font-family:'Times New Roman',serif;font-size:11pt;margin:2cm;color:#1e293b;}</style></head>
<body>${html}</body></html>`;
  const blob = new Blob(["\ufeff" + fullHTML], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Alteracao_Contratual_Essencial_Contabilidade.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

function exportPDFAlteracaoEssencial(d) {
  const html = buildContractHTMLAlteracaoEssencial(d);
  const w = window.open("", "_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8">
<style>@page{size:A4;margin:2cm;}body{font-family:'Times New Roman',serif;font-size:11pt;color:#1e293b;line-height:1.7;}</style>
</head><body>${html}</body></html>`);
  w.document.close();
  setTimeout(() => w.print(), 400);
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ════════════════════════════════════════════
   REACT COMPONENTS
   ════════════════════════════════════════════ */

function Field({ field, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const base = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: `1.5px solid ${focused ? C.accent : C.border}`,
    fontSize: 14, fontFamily: "'DM Sans', sans-serif",
    outline: "none", background: "#fff", color: C.text,
    transition: "border-color .2s, box-shadow .2s",
    boxShadow: focused ? `0 0 0 3px ${C.accent}22` : "none",
  };
  if (field.type === "select") {
    return (
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
          {field.label}
        </label>
        <select style={{ ...base, cursor: "pointer" }} value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}>
          {field.opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: C.muted, marginBottom: 4, fontFamily: "'DM Sans', sans-serif" }}>
        {field.label}
      </label>
      <input style={base} type="text" placeholder={field.ph} value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} />
      {field.hint && <div style={{ fontSize: 11, color: C.light, marginTop: 3, fontStyle: "italic", lineHeight: 1.4 }}>{field.hint}</div>}
    </div>
  );
}

function ActionBtn({ icon, label, onClick, accent }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
        fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
        background: accent || C.accent, color: "#fff",
        boxShadow: hover ? `0 4px 14px ${accent || C.accent}44` : "none",
        transform: hover ? "translateY(-1px)" : "none",
        transition: "all .2s",
      }}>
      {icon} {label}
    </button>
  );
}

/* ═══ CONTRACT PAPER (Live Preview) ═══ */
function ContractPaper({ data }) {
  const d = data;
  const placeholder = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "13pt", color: "#1a365d", borderBottom: "1.5px solid #2b6cb0", paddingBottom: 4, marginTop: 22, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 24, letterSpacing: 0.5, fontWeight: 700 }}>
        INSTRUMENTO PARTICULAR DE CONTRATO DE PRESTAÇÃO DE SERVIÇOS PROFISSIONAIS CONTÁBEIS
      </h1>

      <p style={pStyle}>
        <b>CONTRATADO</b> - <b>{d.cd_razao}</b>, nome fantasia: <b>{d.cd_fantasia}</b>, com sede na {d.cd_endereco}, CEP: {d.cd_cep}, inscrito CNPJ n.°{d.cd_cnpj}, registrado no CRC/MG sob o nº {d.cd_crc}, neste ato representada por sua sócia administrativa, <b>{d.cd_socia_nome}</b>, {d.cd_socia_nacionalidade}, {d.cd_socia_profissao}, {d.cd_socia_estado_civil}, portadora do nº CPF n.º {d.cd_socia_cpf}.
      </p>

      <p style={pStyle}>
        <b>CONTRATANTE</b> - <b>{placeholder(d.ct_razao)}</b>, inscrita no CNPJ sob o nº {placeholder(d.ct_cnpj)}, com sede na {placeholder(d.ct_endereco)}, CEP: {placeholder(d.ct_cep)}, neste ato representada por seu sócio <b>{placeholder(d.ct_socio_nome)}</b>, {placeholder(d.ct_socio_nacionalidade)}, {placeholder(d.ct_socio_profissao)}, {placeholder(d.ct_socio_estado_civil)}, portador do CPF n.º {placeholder(d.ct_socio_cpf)}.
      </p>

      <p style={pStyle}>
        Pelo presente instrumento particular, as partes acima, devidamente qualificadas, doravante denominadas simplesmente, <b>CONTRATADA</b> e <b>CONTRATANTE</b>, na melhor forma de direito, ajustam e contratam a prestação de serviços profissionais, segundo as cláusulas e condições adiante arroladas.
      </p>

      <h2 id="clausula-1" style={secStyle}>CLÁUSULA PRIMEIRA — DO OBJETO</h2>
      <p style={pStyle}>O objeto do presente consiste na prestação pela CONTRATADA à CONTRATANTE dos seguintes serviços profissionais, no qual compreende:</p>

      <h2 id="clausula-2" style={secStyle}>CLÁUSULA SEGUNDA — ÁREAS DE SERVIÇO</h2>
      <p style={pStyle}>O profissional contratado obriga-se a prestar seus serviços profissionais ao CONTRATANTE, nas seguintes áreas:</p>
      <p style={{ ...pStyle, fontWeight: 700 }}>1. CONTABILIDADE</p>
      <p style={pStyle}>1.1. Elaboração da Contabilidade de acordo com as Normas Brasileiras de Contabilidade.</p>
      <p style={pStyle}>1.2. Emissão de balancetes.</p>
      <p style={pStyle}>1.3. Elaboração de Balanço Patrimonial e demais Demonstrações Contábeis obrigatórias.</p>
      <p style={{ ...pStyle, fontWeight: 700 }}>2. OBRIGAÇÕES FISCAIS</p>
      <p style={pStyle}>2.1. Orientação e controle de aplicação dos dispositivos legais vigentes, sejam federais, estaduais ou municipais.</p>
      <p style={pStyle}>2.2. Elaboração dos registros fiscais obrigatórios, eletrônicos ou não, perante os órgãos municipais, estaduais e federais, bem como as demais obrigações que se fizerem necessárias.</p>
      <p style={pStyle}>2.3. Atendimento às demais exigências previstas na legislação, bem como aos eventuais procedimentos fiscais.</p>

      <h2 id="clausula-3" style={secStyle}>CLÁUSULA TERCEIRA — DA RESPONSABILIDADE TÉCNICA</h2>
      <p style={pStyle}>O CONTRATADO assume inteira responsabilidade pelos serviços técnicos a que se obrigou, assim como pelas orientações que prestar.</p>

      <h2 id="clausula-4" style={secStyle}>CLÁUSULA QUARTA — DA DOCUMENTAÇÃO</h2>
      <p style={pStyle}>O CONTRATANTE se obriga a separar mensalmente a documentação que deverá ser enviada de forma completa e em boa ordem através dos seguintes endereços de e-mail nos seguintes prazos:</p>
      <p style={pStyle}>Até {d.prazo_folha} dias após o encerramento do mês, para envio dos eventos para folha de pagamento: A/C Fernanda Pontes – Departamento Pessoal: <u>{d.email_pessoal}</u> sempre com cópia para <u>{d.email_contabil}</u>; e até {d.prazo_docs} dias após o encerramento do mês para o envio de arquivos XML de notas de vendas e compras, extrato bancário em arquivo PDF e OFX, e a documentação física das despesas mensais: A/C {d.cd_socia_nome} - Setor Contábil e Fiscal: <u>{d.email_contabil}</u>, a fim de que a CONTRATADA possa executar seus serviços na conformidade com o citado neste instrumento.</p>
      <p style={pStyle}><b>PARÁGRAFO PRIMEIRO</b> - Responsabilizar-se-á o CONTRATADO por todos os documentos a ele entregue pelo CONTRATANTE, enquanto permanecerem sob sua guarda para a consecução dos serviços pactuados, salvo comprovados casos fortuitos e motivos de força maior.</p>
      <p style={pStyle}><b>PARÁGRAFO SEGUNDO</b> - O CONTRATANTE tem ciência da Lei 9.613/98, alterada pela Lei 12.683/2012, especificamente no que trata da lavagem de dinheiro, regulamentada pela Resolução CFC n.º 1.345/13 do Conselho Federal de Contabilidade.</p>

      <h2 id="clausula-5" style={secStyle}>CLÁUSULA QUINTA — DAS ORIENTAÇÕES</h2>
      <p style={pStyle}>As orientações dadas pelo CONTRATADO deverão ser seguidas pela contratante, eximindo-se o primeiro das consequências da não observância do seu cumprimento.</p>

      <h2 id="clausula-6" style={secStyle}>CLÁUSULA SEXTA — DAS OBRIGAÇÕES DO CONTRATADO</h2>
      <p style={pStyle}>O CONTRATADO se obriga a entregar ao contratante, mediante protocolo, com tempo hábil, os documentos necessários para que este efetue os devidos pagamentos e recolhimentos obrigatórios, bem como comprovante de entrega das obrigações acessórias.</p>
      <p style={pStyle}><b>PARÁGRAFO ÚNICO</b> - As multas decorrentes da entrega fora do prazo contratado das obrigações previstas no <i>caput</i> deste artigo, ou que forem decorrentes da imperfeição ou inexecução dos serviços por parte do CONTRATADO, serão de sua responsabilidade.</p>

      <h2 id="clausula-7" style={secStyle}>CLÁUSULA SÉTIMA — DOS HONORÁRIOS</h2>
      <p style={pStyle}>O CONTRATANTE pagará ao contratado pelos serviços prestados, os honorários mensais de R$ {placeholder(d.fin_honorarios)} ({placeholder(d.fin_honorarios_extenso)}), com vencimento a partir do dia <b>{placeholder(d.fin_vencimento)}</b>.</p>
      <p style={pStyle}><b>PARÁGRAFO PRIMEIRO</b> - Os honorários serão reajustados anualmente de acordo com o reajuste do salário-mínimo vigente no país e/ou em comum acordo entre as partes ou quando houver aumento dos serviços contratados.</p>
      <p style={pStyle}><b>PARÁGRAFO SEGUNDO</b> - O valor deste honorário será fixado anualmente pela CONTRATADA, podendo variar conforme a elevação do faturamento, volume de documentos, complexidade das operações e alteração do regime tributário da contratante, mediante comunicação prévia.</p>

      <h2 id="clausula-8" style={secStyle}>CLÁUSULA OITAVA — DO 13º HONORÁRIO</h2>
      <p style={pStyle}>No mês de dezembro de cada ano, será cobrado o equivalente a 01 (um) honorário mensal, a ser pago até o dia 10 daquele mês por conta do Encerramento do Balanço Patrimonial e demais obrigações anuais.</p>

      <h2 id="clausula-9" style={secStyle}>CLÁUSULA NONA — DA MANUTENÇÃO MENSAL</h2>
      <p style={pStyle}>Os honorários contábeis serão cobrados mensalmente independente da empresa estar em atividade ou não, independente da empresa estar emitindo nota fiscal ou não, pela consultoria contábil a disposição do cliente bem como a manutenção contábil mensal da empresa em questão.</p>

      <h2 id="clausula-10" style={secStyle}>CLÁUSULA DÉCIMA — SEGREGAÇÃO DE RECEITAS (EQUIPARAÇÃO HOSPITALAR)</h2>
      <p style={pStyle}>A CONTRATANTE declara estar ciente de que poderá usufruir do benefício fiscal de <b>Equiparação Hospitalar</b>, nos termos do art. 15, §1º, inciso III, alínea "a", da Lei nº 9.249/95, e demais dispositivos legais aplicáveis, para fins de redução da base de cálculo do IRPJ e da CSLL sobre as receitas oriundas de <b>serviços hospitalares</b>.</p>

      <p style={pStyle}><b>§1º — Segregação das receitas</b></p>
      <p style={pStyle}>A CONTRATANTE compromete-se a <b>segregar mensalmente</b> suas receitas, informando à CONTRATADA a distinção entre:</p>
      <p style={pStyle}>• <b>Serviços hospitalares</b>, caracterizados por procedimentos invasivos, cirúrgicos ou realizados com estrutura equiparada à hospitalar;</p>
      <p style={pStyle}>• <b>Demais serviços odontológicos</b>, sem natureza hospitalar.</p>
      <p style={pStyle}>A planilha de segregação deverá ser encaminhada até o <b>5º (quinto) dia útil de cada mês</b>, acompanhada dos comprovantes necessários.</p>

      <p style={pStyle}><b>§2º — Bases de cálculo e alíquotas aplicáveis</b></p>
      <p style={pStyle}>As partes reconhecem que, no <b>regime de Lucro Presumido</b>, a apuração dos tributos federais ocorre sobre <b>percentuais presumidos da receita bruta</b>, resultando nas seguintes <b>alíquotas efetivas</b> sobre o faturamento:</p>

      <table style={{ width: "100%", borderCollapse: "collapse", margin: "8pt 0", fontSize: "9pt" }}>
        <thead>
          <tr style={{ background: "#1a365d", color: "#fff" }}>
            <th style={{ padding: 6, border: "1px solid #ccc", textAlign: "left" }}>Tipo de Serviço</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Imposto</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Base Presumida</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Alíq. Tributo</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Alíq. Efetiva</th>
          </tr>
        </thead>
        <tbody>
          <tr><td style={{ padding: 4, border: "1px solid #ccc" }} rowSpan={5}><b>Hospitalar</b></td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>IRPJ</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>8%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>15%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>1,20%</td></tr>
          <tr><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>CSLL</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>12%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>9%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>1,08%</td></tr>
          <tr><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>PIS</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>—</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>0,65%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>0,65%</td></tr>
          <tr><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>COFINS</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>—</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>3,00%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>3,00%</td></tr>
          <tr><td colSpan={3} style={{ padding: 4, border: "1px solid #ccc", textAlign: "right", fontWeight: 700 }}>Total hospitalares</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>5,93%</td></tr>
          <tr><td style={{ padding: 4, border: "1px solid #ccc" }} rowSpan={5}><b>Não hospitalar</b></td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>IRPJ</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>32%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>15%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>4,80%</td></tr>
          <tr><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>CSLL</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>32%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>9%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>2,88%</td></tr>
          <tr><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>PIS</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>—</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>0,65%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>0,65%</td></tr>
          <tr><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>COFINS</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>—</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>3,00%</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>3,00%</td></tr>
          <tr><td colSpan={3} style={{ padding: 4, border: "1px solid #ccc", textAlign: "right", fontWeight: 700 }}>Total não hospitalares</td><td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center", fontWeight: 700 }}>11,33%</td></tr>
        </tbody>
      </table>

      <p style={pStyle}><b>Obs.:</b> As alíquotas acima referem-se aos tributos <b>federais (IRPJ, CSLL, PIS e COFINS)</b>. A alíquota de <b>ISS municipal</b> conforme a legislação do município de Belo Horizonte está em 3%.</p>

      <p style={pStyle}><b>§3º — Responsabilidade pela informação e comprovação</b></p>
      <p style={pStyle}>A CONTRATANTE é responsável por:</p>
      <p style={pStyle}>1. Identificar corretamente as receitas de natureza hospitalar e não hospitalar;</p>
      <p style={pStyle}>2. Manter sob sua guarda os documentos comprobatórios (notas fiscais, prontuários, relatórios de procedimentos etc.);</p>
      <p style={pStyle}>3. Fornecer informações verídicas e completas à CONTRATADA para fins de apuração tributária.</p>
      <p style={pStyle}>A CONTRATADA aplicará as alíquotas reduzidas <b>somente sobre as receitas devidamente comprovadas e informadas</b> como hospitalares, isentando-se de qualquer responsabilidade por autuação fiscal decorrente de omissão, erro ou ausência de comprovação documental.</p>

      <p style={pStyle}><b>§4º — Falta de segregação</b></p>
      <p style={pStyle}>Caso a CONTRATANTE <b>não apresente as informações de segregação</b> no prazo estabelecido, a CONTRATADA aplicará, por padrão, as bases de cálculo de <b>32% para IRPJ e CSLL</b>, e as alíquotas de <b>0,65% (PIS)</b> e <b>3,00% (COFINS)</b> sobre a totalidade do faturamento.</p>

      <p style={pStyle}><b>§5º — Transparência tributária</b></p>
      <p style={pStyle}>As alíquotas descritas nesta cláusula têm caráter <b>informativo e orientativo</b>, podendo ser alteradas por força de legislação superveniente.</p>

      <h2 id="clausula-11" style={secStyle}>CLÁUSULA DÉCIMA PRIMEIRA — DA MULTA POR ATRASO</h2>
      <p style={pStyle}>No caso de atraso no pagamento dos honorários, incidirá multa de 10% (dez por cento). Persistindo o atraso, por período de 3 (três) meses, o CONTRATADO poderá rescindir o contrato, por motivo justificado, eximindo-se de qualquer responsabilidade a partir da data da rescisão.</p>

      <h2 id="clausula-12" style={secStyle}>CLÁUSULA DÉCIMA SEGUNDA — DOS SERVIÇOS EXTRAORDINÁRIOS</h2>
      <p style={pStyle}>Todos os serviços extraordinários não contratados que forem necessários ou solicitados pelo CONTRATANTE serão cobrados à parte, com preços previamente convencionados, exemplificativamente:</p>
      <p style={pStyle}>01) Alteração contratual;<br/>02) Abertura de empresa;<br/>03) Declaração de ajuste do Imposto de renda pessoa física;<br/>04) Preenchimento de fichas cadastrais/IBGE;<br/>05) Encerramento de empresas.</p>

      <h2 id="clausula-13" style={secStyle}>CLÁUSULA DÉCIMA TERCEIRA — DA VIGÊNCIA E RESCISÃO</h2>
      <p style={pStyle}>Este instrumento é feito por tempo indeterminado, iniciando-se em <b>{placeholder(d.vig_inicio)}</b>, podendo ser rescindido em qualquer época, por qualquer uma das partes, mediante Aviso Prévio de 30 (trinta) dias, por escrito.</p>
      <p style={pStyle}><b>PARÁGRAFO PRIMEIRO</b> - A parte que não comunicar por escrito a intenção de rescindir o contrato ou efetuá-la de forma sumária fica obrigada ao pagamento de multa compensatória no valor de uma parcela mensal dos honorários vigentes à época.</p>
      <p style={pStyle}><b>PARÁGRAFO SEGUNDO</b> - O rompimento do vínculo contratual obriga as partes à celebração de distrato com a especificação da cessação das responsabilidades dos contratantes.</p>
      <p style={pStyle}><b>PARÁGRAFO TERCEIRO</b> - O CONTRATADO obriga-se a entregar os documentos, Fiscais e/ou arquivos eletrônicos ao contratante ou a outro profissional da Contabilidade por ele indicado, após a assinatura do distrato entre as partes.</p>

      <h2 id="clausula-14" style={secStyle}>CLÁUSULA DÉCIMA QUARTA — DOS CASOS OMISSOS</h2>
      <p style={pStyle}>Os casos omissos serão resolvidos de comum acordo.</p>
      <p style={pStyle}><b>PARÁGRAFO ÚNICO</b> - Em caso de impasse, as partes submeterão a solução do conflito a procedimento arbitral nos termos da Lei n.º 9.307/96.</p>

      <h2 id="clausula-15" style={secStyle}>CLÁUSULA DÉCIMA QUINTA — DO FORO</h2>
      <p style={pStyle}>Fica eleito o foro da comarca de {d.vig_foro}, para o fim de dirimir qualquer ação oriunda do presente contrato.</p>
      <p style={pStyle}>E, para firmeza e como prova de assim haverem contratado, firmam este instrumento particular, impresso em duas vias de igual teor e forma, assinado pelas partes contratantes.</p>
      <p style={pStyle}>{placeholder(d.vig_local_data, "Belo Horizonte, __ de ________ de ____")}</p>

      <div style={{ marginTop: 50, display: "flex", justifyContent: "space-between", gap: 40 }}>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{placeholder(d.ct_razao)} - CONTRATANTE</b><br />
          CNPJ: {placeholder(d.ct_cnpj)}<br />
          Sócio Administrador: {placeholder(d.ct_socio_nome)}<br />
          CPF: {placeholder(d.ct_socio_cpf)}
        </div>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{d.cd_razao} – CONTRATADA</b><br />
          CNPJ: {d.cd_cnpj}<br />
          Sócia Administradora: {d.cd_socia_nome}<br />
          CPF: {d.cd_socia_cpf}
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT PAPER — CONTRATO SOCIAL (Live Preview) ═══ */
function SocioTextJSX({ d, prefix, ph }) {
  const n = d[`${prefix}_nome`];
  if (!n) return <span style={{ color: C.light, fontStyle: "italic" }}>________</span>;
  return <>
    {d[`${prefix}_nacionalidade`] || ph("________")}
    {d[`${prefix}_nascido_exterior`] ? `, ${d[`${prefix}_nascido_exterior`]}` : ""}
    , {d[`${prefix}_estado_civil`] || ph("________")}
    , {d[`${prefix}_profissao`] || ph("________")}
    , nascida em {d[`${prefix}_nascimento`] || ph("________")}
    , portadora do CPF nº {d[`${prefix}_cpf`] || ph("________")} e ID nº {d[`${prefix}_rg`] || ph("________")}
    , residente e domiciliada à {d[`${prefix}_endereco`] || ph("________")}, CEP {d[`${prefix}_cep`] || ph("________")}
  </>;
}

function ContractPaperSocial({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "13pt", color: "#1a365d", borderBottom: "1.5px solid #2b6cb0", paddingBottom: 4, marginTop: 22, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };

  const enqTexto = d.enq_tipo === "EPP"
    ? "inciso II do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006"
    : "inciso I do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006";

  const objetos = [d.emp_objeto_1, d.emp_objeto_2, d.emp_objeto_3].filter(Boolean);

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 style={{ fontSize: "15pt", textAlign: "center", marginBottom: 6, letterSpacing: 0.5, fontWeight: 700 }}>CONTRATO SOCIAL</h1>
      <h2 style={{ fontSize: "13pt", textAlign: "center", marginBottom: 24, fontWeight: 700, color: "#1a365d" }}>{ph(d.emp_denominacao)}</h2>

      <p style={pStyle}><b>{d.s1_nome ? d.s1_nome.toUpperCase() : ph("________")}</b>, <SocioTextJSX d={d} prefix="s1" ph={ph} />;</p>
      <p style={pStyle}><b>{d.s2_nome ? d.s2_nome.toUpperCase() : ph("________")}</b>, <SocioTextJSX d={d} prefix="s2" ph={ph} />;</p>

      <p style={pStyle}>Resolvem constituir uma sociedade empresária limitada, que se regerá pelas cláusulas seguintes e pela Lei nº 10.406/2002.</p>

      <h2 id="cs-1" style={secStyle}>CLÁUSULA 1ª – DA DENOMINAÇÃO, SEDE E PRAZO</h2>
      <p style={pStyle}>A sociedade girará sob a denominação social: <b>{ph(d.emp_denominacao)}</b>, com sede à {ph(d.emp_endereco)}, CEP {ph(d.emp_cep)} e o prazo de duração é indeterminado.</p>

      <h2 id="cs-2" style={secStyle}>CLÁUSULA 2ª – DO OBJETO SOCIAL</h2>
      <p style={pStyle}>A sociedade terá por objeto:</p>
      {objetos.length > 0 ? objetos.map((o, i) => (
        <p key={i} style={pStyle}>{["I", "II", "III"][i]} – {o}</p>
      )) : <p style={pStyle}>I – <span style={{ color: C.light, fontStyle: "italic" }}>________</span></p>}

      <h2 id="cs-3" style={secStyle}>CLÁUSULA 3ª – DO CAPITAL SOCIAL</h2>
      <p style={pStyle}>O capital social é de R$ {ph(d.cap_total)} ({ph(d.cap_total_extenso)}), dividido em {ph(d.cap_num_quotas)}({ph(d.cap_num_quotas_extenso)}) quotas no valor nominal de R$ {ph(d.cap_valor_quota)} ({ph(d.cap_valor_quota_extenso)}) cada, totalmente subscrito e integralizado neste ato, em moeda corrente nacional, distribuído da seguinte forma:</p>
      <p style={pStyle}><b>{ph(d.s1_nome)}</b> – {ph(d.s1_quotas)} quotas – R$ {ph(d.s1_valor)} – {ph(d.s1_percentual)}%</p>
      <p style={pStyle}><b>{ph(d.s2_nome)}</b> – {ph(d.s2_quotas)} quotas – R$ {ph(d.s2_valor)} – {ph(d.s2_percentual)}%</p>
      <p style={pStyle}>A responsabilidade de cada sócia é restrita ao valor de suas quotas, mas todas respondem solidariamente pela integralização do capital social.</p>

      <h2 id="cs-4" style={secStyle}>CLÁUSULA 4ª – DA ADMINISTRAÇÃO</h2>
      <p style={pStyle}>A administração da sociedade será exercida por <b>{ph(d.adm_nome)}</b>, que representará a sociedade ativa e passivamente, judicial e extrajudicialmente, podendo praticar todos os atos necessários ao cumprimento do objeto social.</p>
      <p style={pStyle}>Na hipótese de falecimento ou incapacidade da administradora, a administração será exercida pela sócia remanescente ou por terceiro de sua indicação exclusiva, vedada a interferência de qualquer representante ou procurador constituído pela sócia falecida ou incapaz.</p>
      <p style={pStyle}>É vedado à administradora utilizar a sociedade para fins estranhos ao objeto social.</p>

      <h2 id="cs-5" style={secStyle}>CLÁUSULA 5ª – DO PRÓ-LABORE</h2>
      <p style={pStyle}>A administradora poderá retirar pró-labore em valor fixado de comum acordo entre as sócias, observada a legislação vigente.</p>

      <h2 id="cs-6" style={secStyle}>CLÁUSULA 6ª – DO ENQUADRAMENTO DE MICROEMPRESA</h2>
      <p style={pStyle}>Os sócios declaram que o movimento da receita bruta anual da empresa não excederá o limite fixado no {enqTexto}, e que não se enquadra(m) em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.</p>

      <h2 id="cs-7" style={secStyle}>CLÁUSULA 7ª – DO EXERCÍCIO SOCIAL</h2>
      <p style={pStyle}>O exercício social encerra-se em 31 de dezembro de cada ano, quando serão levantadas as demonstrações financeiras.</p>
      <p style={pStyle}>Os lucros apurados poderão ser distribuídos às sócias na proporção de suas quotas ou em proporção diversa, mediante deliberação unânime.</p>

      <h2 id="cs-8" style={secStyle}>CLÁUSULA 8ª – DA CESSÃO DE QUOTAS</h2>
      <p style={pStyle}>A cessão ou transferência de quotas dependerá do consentimento da outra sócia, que terá direito de preferência em igualdade de condições.</p>
      <p style={pStyle}>É vedado o ingresso de terceiros no quadro societário sem expressa anuência da sócia remanescente.</p>

      <h2 id="cs-9" style={secStyle}>CLÁUSULA 9ª – DA INCOMUNICABILIDADE</h2>
      <p style={pStyle}>As quotas sociais não se comunicarão com o cônjuge ou companheiro das sócias, independentemente do regime de bens, permanecendo de propriedade exclusiva da respectiva titular.</p>

      <h2 id="cs-10" style={secStyle}>CLÁUSULA 10ª – DA RETIRADA IMOTIVADA</h2>
      <p style={pStyle}>Qualquer sócia poderá retirar-se da sociedade mediante notificação escrita com antecedência mínima de {ph(d.ret_prazo_dias)} dias.</p>
      <p style={pStyle}>A retirada não implicará dissolução da sociedade.</p>

      <h2 id="cs-11" style={secStyle}>CLÁUSULA 11ª – DA APURAÇÃO DE HAVERES</h2>
      <p style={pStyle}>Nos casos de retirada, exclusão, falecimento ou dissolução parcial, os haveres da sócia serão apurados com base em balanço patrimonial especialmente levantado na data do evento, considerando-se o valor contábil do patrimônio líquido.</p>
      <p style={pStyle}>O pagamento poderá ser efetuado em até {ph(d.hav_parcelas)} parcelas mensais e sucessivas, corrigidas pelo {ph(d.hav_indice)}.</p>

      <h2 id="cs-12" style={secStyle}>CLÁUSULA 12ª – DO FALECIMENTO</h2>
      <p style={pStyle}>O falecimento de qualquer sócia não implicará dissolução da sociedade, podendo a remanescente optar pela liquidação das quotas mediante apuração de haveres ou pela admissão dos herdeiros, mediante alteração contratual.</p>

      <h2 id="cs-13" style={secStyle}>CLÁUSULA 13ª – DOS CREDORES PARTICULARES</h2>
      <p style={pStyle}>Na hipótese de constrição judicial de quotas por dívidas particulares de qualquer sócia, o credor limitar-se-á ao recebimento dos direitos econômicos eventualmente distribuídos, não lhe sendo assegurado direito de participação na administração da sociedade.</p>

      <h2 id="cs-14" style={secStyle}>CLÁUSULA 14ª – DO FORO</h2>
      <p style={pStyle}>Fica eleito o foro da Comarca de {ph(d.vig_foro)} para dirimir quaisquer controvérsias oriundas deste contrato.</p>
      <p style={pStyle}>E por estarem assim justas e contratadas, assinam o presente instrumento.</p>
      <p style={pStyle}>{ph(d.vig_local_data, "Local e data")}</p>

      <div style={{ marginTop: 50, display: "flex", justifyContent: "space-between", gap: 40 }}>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{ph(d.s1_nome)}</b>
        </div>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{ph(d.s2_nome)}</b>
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT PAPER — CABELEIREIRO (Live Preview) ═══ */
function ContractPaperCabeleireiro({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "13pt", color: "#1a365d", borderBottom: "1.5px solid #2b6cb0", paddingBottom: 4, marginTop: 22, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };
  const cellStyle = { padding: 4, border: "1px solid #ccc" };
  const cellCenter = { ...cellStyle, textAlign: "center" };

  const enqTexto = d.ne_porte === "EPP" ? "inciso II" : "inciso I";
  const porteTxt = d.ne_porte === "MEI" ? "Microempreendedor Individual" : d.ne_porte === "EPP" ? "Empresa de Pequeno Porte" : "Microempresa";

  const TabelaQuotas = () => (
    <table style={{ width: "100%", borderCollapse: "collapse", margin: "8pt 0" }}>
      <thead>
        <tr style={{ background: "#1a365d", color: "#fff" }}>
          <th style={{ padding: 6, border: "1px solid #ccc", textAlign: "left" }}>Sócio</th>
          <th style={{ padding: 6, border: "1px solid #ccc" }}>Quotas</th>
          <th style={{ padding: 6, border: "1px solid #ccc" }}>Valor unitário(R$)</th>
          <th style={{ padding: 6, border: "1px solid #ccc" }}>Total (R$)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>{ph(d.sc_nome && d.sc_nome.toUpperCase())}</td>
          <td style={cellCenter}>{ph(d.cap_quotas_socio)}</td>
          <td style={cellCenter}>{ph(d.cap_valor_quota)}</td>
          <td style={cellCenter}>{ph(d.cap_total)}</td>
        </tr>
        <tr style={{ fontWeight: 700 }}>
          <td style={cellStyle}>Total</td>
          <td style={cellCenter}>{ph(d.cap_quotas_socio)}</td>
          <td style={cellCenter}>{ph(d.cap_valor_quota)}</td>
          <td style={cellCenter}>{ph(d.cap_total)}</td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 4, fontWeight: 700 }}>CONTRATO SOCIAL</h1>
      <h2 id="cc-transf" style={{ fontSize: "12pt", textAlign: "center", marginBottom: 4, fontWeight: 700, color: "#1a365d" }}>POR TRANSFORMAÇÃO DE EMPRESÁRIO {ph(d.eo_razao && d.eo_razao.toUpperCase())}</h2>
      <p style={{ textAlign: "center", marginBottom: 16, fontWeight: 600 }}>CNPJ {ph(d.eo_cnpj)}</p>

      <p style={pStyle}>
        <b>{d.sc_nome ? d.sc_nome.toUpperCase() : ph("________")}</b>, {ph(d.sc_nacionalidade)}, {ph(d.sc_estado_civil)}, {ph(d.sc_profissao)}, nascido em {ph(d.sc_nascimento)}, com documento de identidade nº {ph(d.sc_rg)}, {ph(d.sc_rg_orgao)}, CPF nº {ph(d.sc_cpf)}, residente e domiciliado na {ph(d.sc_endereco)}, CEP {ph(d.sc_cep)}. Empresário Individual, com sede na {ph(d.eo_sede)}, CEP {ph(d.eo_cep_sede)}, inscrito na Junta Comercial do Estado de Minas Gerais sob o NIRE {ph(d.eo_nire)}, razão social {ph(d.eo_razao)} em {ph(d.eo_data_registro)} e no CNPJ sob o nº {ph(d.eo_cnpj)}, fazendo uso do que permite o § 3º do art. 968 da Lei nº 10.406/2002, com a redação alterada pelo art. 10 da Lei Complementar nº 128/2008, ora transforma seu registro de EMPRESÁRIO em SOCIEDADE EMPRESÁRIA, passando a constituir o tipo jurídico SOCIEDADE EMPRESARIA LIMITADA, a qual se regerá.
      </p>

      <p style={pStyle}>Neste mesmo ato informa-se o valor do capital social da empresa com a distribuição das quotas citadas, objeto social, nome empresarial, endereço e Enquadramento quanto ao Porte, doravante, pelo presente a qual se regerá;</p>

      <h2 id="cc-1" style={secStyle}>CLÁUSULA PRIMEIRA</h2>
      <p style={pStyle}>A razão Social passa a ser <b>{ph(d.ne_razao)}</b>.</p>

      <h2 id="cc-2" style={secStyle}>CLÁUSULA SEGUNDA</h2>
      <p style={pStyle}>O Capital Social é de R$ {ph(d.cap_total)}({ph(d.cap_total_extenso)}), divididos em {ph(d.cap_num_quotas)} ({ph(d.cap_num_quotas_extenso)}) quotas no valor de R$ {ph(d.cap_valor_quota)}({ph(d.cap_valor_quota_extenso)}) cada, com a seguinte distribuição:</p>
      <TabelaQuotas />

      <h2 id="cc-3" style={secStyle}>CLÁUSULA TERCEIRA</h2>
      <p style={pStyle}>O objeto social é {ph(d.ne_objeto)}.</p>

      <h2 id="cc-4" style={secStyle}>CLÁUSULA QUARTA</h2>
      <p style={pStyle}>O Porte da Empresa é {porteTxt}, o signatário do presente ato declara que o movimento da receita bruta anual da empresa não excederá o limite fixado no {enqTexto} do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006, e que não se enquadra em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.</p>

      {/* ═══ CONSOLIDAÇÃO ═══ */}
      <div id="cc-consol" style={{ marginTop: 30, borderTop: "2px solid #1a365d", paddingTop: 16 }}>
        <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 4, fontWeight: 700 }}>Consolidação do Contrato Social</h1>
        <h2 style={{ fontSize: "12pt", textAlign: "center", marginBottom: 4, fontWeight: 700, color: "#1a365d" }}>{ph(d.ne_razao)}</h2>
        <p style={{ textAlign: "center", marginBottom: 16, fontWeight: 600 }}>CNPJ {ph(d.eo_cnpj)}</p>
      </div>

      <p style={pStyle}>
        <b>{d.sc_nome ? d.sc_nome.toUpperCase() : ph("________")}</b>, {ph(d.sc_nacionalidade)}, {ph(d.sc_estado_civil)}, {ph(d.sc_profissao)}, nascido em {ph(d.sc_nascimento)}, com documento de identidade nº {ph(d.sc_rg)}, {ph(d.sc_rg_orgao)}, CPF nº {ph(d.sc_cpf)}, residente e domiciliado na {ph(d.sc_endereco)}, CEP {ph(d.sc_cep)}, sócio da sociedade empresária limitada, inscrita no CNPJ sob o nº {ph(d.eo_cnpj)}, consolida neste ato seu Contrato Social, mediante as seguintes cláusulas:
      </p>

      <h2 id="cc-c1" style={secStyle}>CLÁUSULA PRIMEIRA</h2>
      <p style={pStyle}>A sociedade girará sob o nome empresarial de <b>{ph(d.ne_razao)}</b>, com sede na {ph(d.ne_sede)}, CEP {ph(d.ne_cep_sede)}.</p>

      <h2 id="cc-c2" style={secStyle}>CLÁUSULA SEGUNDA</h2>
      <p style={pStyle}>O objeto social é {ph(d.ne_objeto)}.</p>

      <h2 id="cc-c3" style={secStyle}>CLÁUSULA TERCEIRA</h2>
      <p style={pStyle}>O Capital Social é de R$ {ph(d.cap_total)}({ph(d.cap_total_extenso)}), divididos em {ph(d.cap_num_quotas)} ({ph(d.cap_num_quotas_extenso)}) quotas no valor de R$ {ph(d.cap_valor_quota)}({ph(d.cap_valor_quota_extenso)}) cada, com a seguinte distribuição:</p>
      <TabelaQuotas />

      <h2 id="cc-c4" style={secStyle}>CLÁUSULA QUARTA</h2>
      <p style={pStyle}>A responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social, conforme art. 1.052 CC/2002.</p>

      <h2 id="cc-c5" style={secStyle}>CLÁUSULA QUINTA</h2>
      <p style={pStyle}>A administração da sociedade será exercida pelo sócio <b>{ph(d.adm_nome && d.adm_nome.toUpperCase())}</b>, respondendo pela empresa, judicial e extrajudicialmente, em juízo ou fora dele, em conjunto ou individual, podendo praticar todos os atos compreendidos no objeto social, sempre no interesse da sociedade, ficando vedado o uso da denominação social em negócios estranhos aos fins sociais, bem como onerar bens imóveis da sociedade, sem autorização do outro sócio.</p>

      <h2 id="cc-c6" style={secStyle}>CLÁUSULA SEXTA</h2>
      <p style={pStyle}>A atividade iniciou em {ph(d.vig_data_inicio)} e o prazo de duração da sociedade será por tempo indeterminado. O porte da empresa é {porteTxt}.</p>
      <p style={pStyle}>O signatário do presente ato declara que o movimento da receita bruta anual da empresa não excederá o limite fixado no {enqTexto} do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006, e que não se enquadra em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.</p>

      <h2 id="cc-c7" style={secStyle}>CLÁUSULA SÉTIMA</h2>
      <p style={pStyle}>As quotas são indivisíveis e não poderão ser cedidas ou transferidas no todo ou em parte a terceiros, sem expresso consentimento do outro sócio, a quem fica assegurado, em igualdade de condições e preço, direito de preferência para a sua aquisição, formalizando, se realizada a cessão delas, a alteração contratual pertinente.</p>

      <h2 id="cc-c8" style={secStyle}>CLÁUSULA OITAVA</h2>
      <p style={pStyle}>Que a empresa poderá a qualquer tempo, abrir ou fechar filiais, em qualquer parte do país, se assim, em conjunto, decidirem os sócios em conjunto, mediante alteração contratual assinada por todos os sócios.</p>

      <h2 id="cc-c9" style={secStyle}>CLÁUSULA NONA</h2>
      <p style={pStyle}>Que o exercício social coincidirá com o ano civil. Ao término de cada exercício, o administrador prestará contas justificadas de sua administração, procedendo à elaboração das demonstrações financeiras, cabendo aos sócios, na proporção de suas quotas, os lucros ou perdas apurados.</p>

      <h2 id="cc-c10" style={secStyle}>CLÁUSULA DÉCIMA</h2>
      <p style={pStyle}>Em caso de morte de um dos sócios, a sociedade não será dissolvida e continuará sendo gerida pelo sócio remanescente ou pelos herdeiros. Não sendo possível ou inexistindo interesse destes ou do sócio remanescente, os valores de seus haveres serão apurados e liquidados com base na situação patrimonial da empresa. O mesmo procedimento será adotado em qualquer dos casos em que a sociedade se resolva em relação a um dos sócios.</p>

      <h2 id="cc-c11" style={secStyle}>CLÁUSULA DÉCIMA PRIMEIRA</h2>
      <p style={pStyle}>Pode o sócio ser excluído, quando a maioria dos sócios, representativa de mais da metade do capital social, entender que um ou mais sócios estão pondo em risco a continuidade da empresa, em virtude de atos graves e que configurem justa causa segundo artigo 1.085 do CC/2002.</p>

      <h2 id="cc-c12" style={secStyle}>CLÁUSULA DÉCIMA SEGUNDA</h2>
      <p style={pStyle}>Que os administradores declaram, sob as penas da lei, que não estão incursos em quaisquer crimes previstos em lei ou restrições legais, que possam impedi-los de exercer atividade empresarial conforme artigo 1.011, 1º do CC/2002.</p>

      <h2 id="cc-c13" style={secStyle}>CLÁUSULA DÉCIMA TERCEIRA</h2>
      <p style={pStyle}>As partes elegem o foro de {ph(d.vig_foro)} para dirimir quaisquer dúvidas decorrente do presente instrumento contratual, bem como para o exercício e cumprimento dos direitos e obrigações resultantes deste contrato, sendo que os administradores renunciam a qualquer outro, por mais privilegiado que possa ser.</p>

      <p style={pStyle}>E, por estarem justos e contratados, assinam o presente instrumento particular digitalmente.</p>

      <p style={pStyle}>{ph(d.vig_local_data, "Local e data")}</p>

      <div style={{ marginTop: 50 }}>
        <div style={{ width: "50%", textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{d.sc_nome ? d.sc_nome.toUpperCase() : ph("________")}</b><br />
          Sócio Administrador
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT PAPER — PARCERIA SALÃO (Live Preview) ═══ */
function ContractPaperParceria({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "13pt", color: "#1a365d", borderBottom: "1.5px solid #2b6cb0", paddingBottom: 4, marginTop: 22, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };
  const cellStyle = { padding: 4, border: "1px solid #ccc" };
  const cellCenter = { ...cellStyle, textAlign: "center" };

  const tabelaRows = [1,2,3].map(i => {
    const s = d[`cond_tabela_servico${i}`];
    const pp = d[`cond_tabela_parceiro${i}`];
    const sp = d[`cond_tabela_salao${i}`];
    if (!s && !pp && !sp) return null;
    return <tr key={i}><td style={cellStyle}>{ph(s)}</td><td style={cellCenter}>{ph(pp)}%</td><td style={cellCenter}>{ph(sp)}%</td></tr>;
  }).filter(Boolean);

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 24, letterSpacing: 0.5, fontWeight: 700 }}>
        CONTRATO DE PARCERIA ENTRE SALÃO-PARCEIRO E PROFISSIONAL-PARCEIRO CONFORME LEI 13352/16
      </h1>

      <h2 id="pc-1" style={secStyle}>I - DAS PARTES</h2>
      <p style={pStyle}>Assinam o presente instrumento, nele assumindo, cada uma delas, a seu título, direitos e obrigações, as seguintes partes:</p>

      <p style={pStyle}>
        Como <b>SALÃO-PARCEIRO</b>: <b>{ph(d.sp_razao)}</b>, pessoa jurídica de direito privado, inscrita no CNPJ/MF sob o nº {ph(d.sp_cnpj)}, com sede na {ph(d.sp_endereco)}, n° {ph(d.sp_numero)}, bairro {ph(d.sp_bairro)}, em {ph(d.sp_cidade_uf)}, CEP {ph(d.sp_cep)}, telefone {ph(d.sp_telefone)}, e-mail {ph(d.sp_email)}, neste ato representado pelo(a) sócio(a) administrador(a) <b>{ph(d.sp_socio1_nome)}</b>, {ph(d.sp_socio1_nacionalidade)}, {ph(d.sp_socio1_estado_civil)}, {ph(d.sp_socio1_profissao)}, inscrito(a) no CPF/MF sob o n° {ph(d.sp_socio1_cpf)}, portador(a) da cédula de identidade {ph(d.sp_socio1_rg)}, residente e domiciliado(a) na {ph(d.sp_socio1_endereco)}, n° {ph(d.sp_socio1_numero)}, bairro {ph(d.sp_socio1_bairro)}, em {ph(d.sp_socio1_cidade_uf)}, CEP {ph(d.sp_socio1_cep)}
.
      </p>

      <p style={pStyle}>
        Como <b>PROFISSIONAL-PARCEIRO</b>: <b>{ph(d.pp_nome)}</b>, {ph(d.pp_nacionalidade)}, {ph(d.pp_estado_civil)}, {ph(d.pp_profissao)}, inscrito(a) no CPF/MF sob o n° {ph(d.pp_cpf)}, profissional autônomo(a) classificado(a) como Microempreendedor(a) Individual - MEI e inscrito(a) no CNPJ/MF sob o nº {ph(d.pp_cnpj_mei)}, residente e domiciliado(a) na {ph(d.pp_endereco)}, n° {ph(d.pp_numero)}, bairro {ph(d.pp_bairro)}, em {ph(d.pp_cidade_uf)}, CEP {ph(d.pp_cep)}, Fone/Cel. {ph(d.pp_telefone)}, e-mail {ph(d.pp_email)}.
      </p>

      <p style={pStyle}>As partes, após terem lido e compreendido o sentido e alcance das cláusulas, resolvem pactuar o presente Instrumento Particular de Parceria para Prestação de Serviços em Salão de Beleza, em consonância com o que estabelece a Lei n° 13.352/2016, submetendo-se às cláusulas e condições seguintes, tendo entre si certo e ajustado seus termos, nele assumindo, cada uma delas, a seu título, respectivamente, direitos e obrigações.</p>

      <h2 id="pc-2" style={secStyle}>II - DO OBJETO DO CONTRATO</h2>
      <p style={pStyle}><b>Cláusula Primeira:</b> O presente contrato tem como objeto a celebração de parceria entre as partes, em que o PROFISSIONAL PARCEIRO prestará os serviços de: <b>{ph(d.cond_servicos)}</b>, dentro do espaço fornecido pelo SALÃO PARCEIRO, tudo de acordo com os termos estabelecidos neste instrumento.</p>

      <h2 id="pc-3" style={secStyle}>III – DOS PERCENTUAIS E CONDIÇÕES DO REPASSE</h2>
      <p style={pStyle}><b>Cláusula Segunda:</b> O SALÃO-PARCEIRO será responsável pela centralização dos recursos decorrentes das atividades de prestação de serviços de beleza realizadas pelo PROFISSIONAL-PARCEIRO, sendo que todos os pagamentos dos clientes serão recebidos, na sua integralidade pelo SALÃO-PARCEIRO.</p>

      <p style={pStyle}><b>Cláusula Terceira:</b> Dos pagamentos dos clientes pelos serviços prestados pelo PROFISSIONAL-PARCEIRO, o SALÃO-PARCEIRO realizará a retenção de sua quota-parte percentual, fixada, para cada serviço, nos percentuais descritos na tabela abaixo, a qual é parte integrante deste instrumento, além da retenção dos valores de recolhimento de tributos, contribuições sociais e previdenciárias incidentes sobre a cota-parte, devidas pelo(a) PROFISSIONAL-PARCEIRO ao fisco.</p>

      <table style={{ width: "100%", borderCollapse: "collapse", margin: "8pt 0" }}>
        <thead>
          <tr style={{ background: "#1a365d", color: "#fff" }}>
            <th style={{ padding: 6, border: "1px solid #ccc", textAlign: "left" }}>Serviços</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Comissão Parceiro</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Comissão Salão</th>
          </tr>
        </thead>
        <tbody>
          {tabelaRows.length > 0 ? tabelaRows : (
            <tr><td style={cellStyle}><span style={{ color: C.light, fontStyle: "italic" }}>________</span></td><td style={cellCenter}><span style={{ color: C.light, fontStyle: "italic" }}>____%</span></td><td style={cellCenter}><span style={{ color: C.light, fontStyle: "italic" }}>____%</span></td></tr>
          )}
        </tbody>
      </table>

      <p style={pStyle}><b>Parágrafo Primeiro:</b> A quota-parte do PROFISSIONAL-PARCEIRO corresponderá, portanto, ao remanescente do valor descrito no caput desta cláusula.</p>
      <p style={pStyle}><b>Parágrafo Segundo:</b> A cópia dos comprovantes dos impostos, contribuições sociais e previdenciárias retidas e recolhidos pelo SALÃO-PARCEIRO, serão por ele mantidas e os originais serão repassados ao PROFISSIONAL-PARCEIRO.</p>
      <p style={pStyle}><b>Parágrafo Terceiro:</b> A quota-parte do SALÃO-PARCEIRO, no percentual determinado no caput desta cláusula, ocorrerá a título de atividade de aluguel de espaço físico, bens móveis e utensílios para o desempenho das atividades de serviços de beleza, bem como a título de serviços de gestão, de apoio administrativo, de escritório, de recepção de clientes e marcação de horário, de cobrança e de recebimentos de valores transitórios recebidos de clientes das atividades de serviços de beleza. Já a quota-parte destinada ao PROFISSIONAL-PARCEIRO ocorrerá a título de atividades de prestação de serviços de beleza.</p>

      <p style={pStyle}><b>Cláusula Quarta:</b> O pagamento do percentual do PROFISSIONAL-PARCEIRO será feito pelo SALÃO-PARCEIRO sempre nos dias <b>{ph(d.cond_dia_pagamento)}</b> de cada mês, mediante depósito em conta bancária do PROFISSIONAL-PARCEIRO, devendo depois de confirmado o crédito assinar recibo, se exigido.</p>

      <h2 id="pc-4" style={secStyle}>IV - UTILIZAÇÃO DO MATERIAL E DO ESPAÇO FÍSICO</h2>
      <p style={pStyle}><b>Cláusula Quinta:</b> O SALÃO-PARCEIRO pelo percentual ajustado na Cláusula Terceira cederá para prestação do serviço de beleza do PROFISSIONAL-PARCEIRO o mobiliário, local para o trabalho e tudo relativo à estrutura física e seus acessórios, como energia elétrica, água, telefone, além de disponibilizar secretária e demais recursos necessários ao bom atendimento dos clientes.</p>
      <p style={pStyle}><b>Cláusula Sexta:</b> Para prestação do serviço descrito na Cláusula Primeira, o PROFISSIONAL-PARCEIRO fornecerá toda a sua mão-de-obra especializada, bem como os materiais e ferramentas próprios de seu ofício necessários à execução dos serviços.</p>
      <p style={pStyle}><b>Cláusula Sétima:</b> Para o bom desempenho de suas funções, o PROFISSIONAL-PARCEIRO utilizará e se encarregará de manter os equipamentos e ferramentas necessários à prestação de seus serviços em perfeitas condições de uso, arcando por danos causados aos equipamentos decorrentes de má utilização, não sendo de responsabilidade do SALÃO-PARCEIRO o fornecimento de qualquer material, que não os relacionados na Cláusula Quinta.</p>
      <p style={pStyle}><b>Cláusula Oitava:</b> É vedado ao PROFISSIONAL-PARCEIRO utilizar as instalações do SALÃO-PARCEIRO, para qualquer outro fim que não para a prestação dos serviços objeto do presente contrato.</p>
      <p style={pStyle}><b>Cláusula Nona:</b> O PROFISSIONAL-PARCEIRO exercerá suas atividades e prestação de serviço de beleza com plena autonomia, podendo circular livremente pelas dependências do SALÃO-PARCEIRO, mas a prestação do serviço deverá ocorrer estritamente no ambiente selecionado para seu uso, devendo respeitar a divisão de ambientes para cada tipo de serviço e profissional, salvo quando o cliente estiver em outro setor, sendo atendida por outro profissional, ocasião em que a prestação de serviço do PROFISSIONAL-PARCEIRO poderá ocorrer fora do espaço reservado.</p>
      <p style={pStyle}><b>Cláusula Décima:</b> Quando o estabelecimento estiver fechado, o PROFISSIONAL-PARCEIRO não poderá utilizá-lo, salvo mediante prévia e expressa autorização do SALÃO-PARCEIRO e na presença dos proprietários ou gerente.</p>

      <h2 id="pc-5" style={secStyle}>V – DA MARCAÇÃO DE HORÁRIOS E CONTROLE DE AGENDA</h2>
      <p style={pStyle}><b>Cláusula Décima Primeira:</b> O PROFISSIONAL-PARCEIRO possui autonomia sobre sua agenda. No entanto, para melhor organização do estabelecimento, os horários poderão ser marcados pelos clientes diretamente na recepção do SALÃO-PARCEIRO, com as recepcionistas, tendo o PROFISSIONAL-PARCEIRO total controle e acesso sobre a mesma, para consultas e alterações de horários.</p>
      <p style={pStyle}><b>Cláusula Décima Segunda:</b> O PROFISSIONAL-PARCEIRO é livre para decidir quais os dias e horários não prestará atendimento à sua clientela, entretanto, deverá avisar ao SALÃO-PARCEIRO com antecedência mínima de 48 (quarenta e oito) horas solicitando o remanejo e bloqueio destes horários.</p>
      <p style={pStyle}><b>Parágrafo Único:</b> O bloqueio de agenda a que se refere o caput desta Cláusula só será efetivado mediante assinatura de documento específico pelo PROFISSIONAL-PARCEIRO ou envio de mensagem WhatsApp ao SALÃO-PARCEIRO.</p>

      <h2 id="pc-6" style={secStyle}>VI – DAS OBRIGAÇÕES DO PROFISSIONAL PARCEIRO</h2>
      <p style={pStyle}><b>Cláusula Décima Terceira:</b> É responsabilidade do PROFISSIONAL-PARCEIRO, juntamente com o SALÃO-PARCEIRO manter a higiene de materiais e equipamentos, e as condições de funcionamento do negócio bem como o bom atendimento dos clientes.</p>
      <p style={pStyle}><b>Cláusula Décima Quarta:</b> O PROFISSIONAL-PARCEIRO compromete-se a executar as atividades profissionais objeto deste instrumento com ética, zelo e eficiência, dentro das técnicas consagradas de mercado, a fim de não denegrir o nome do estabelecimento ao qual representa, bem como a cumprir as normas de segurança e saúde, as quais declara conhecer.</p>
      <p style={pStyle}><b>Parágrafo Primeiro:</b> Os produtos descritos na Cláusula Sexta e utilizados na prestação dos serviços objeto deste instrumento pelo PROFISSIONAL-PARCEIRO são de sua inteira responsabilidade, inclusive no que diz respeito ao descarte de materiais que não podem ser reaproveitados bem como à qualidade e observação da data de validade dos produtos, devendo utilizar os que possuem reconhecimento e aprovação pelos órgãos fiscalizadores, como ANVISA (Agência Nacional de Vigilância Sanitária).</p>
      <p style={pStyle}><b>Parágrafo Segundo:</b> Caberá ao PROFISSIONAL-PARCEIRO organizar, limpar, desinfetar e esterilizar os instrumentos de trabalho, utilizando produtos e procedimentos específicos, conforme normas de higiene para conservação em condições de uso, evitar contaminações e preservar a sua saúde, bem como a dos clientes.</p>
      <p style={pStyle}><b>Parágrafo Terceiro:</b> Na hipótese do SALÃO-PARCEIRO ser multado pela Vigilância Sanitária em razão de descumprimento de norma pelo PROFISSIONAL-PARCEIRO, o valor da multa será dividido entre as partes contratantes, proporcionalmente aos percentuais de pagamento descritos na Cláusula Terceira.</p>
      <p style={pStyle}><b>Cláusula Décima Quinta:</b> Os preços dos serviços de beleza praticados pelo PROFISSIONAL-PARCEIRO não poderão ser inferiores aos preços estabelecidos pelo SALÃO PARCEIRO, constantes de tabela afixada no estabelecimento.</p>
      <p style={pStyle}><b>Cláusula Décima Sexta:</b> O PROFISSIONAL-PARCEIRO participará das promoções que o SALÃO-PARCEIRO oferecer aos clientes, sendo que o ônus de tais promoções será dividido entre as partes contratantes.</p>
      <p style={pStyle}><b>Cláusula Décima Sétima:</b> Os produtos comercializados aos clientes pelo SALÃO-PARCEIRO nas dependências do estabelecimento, obedecerão à tabela de preços fornecida pelo SALÃO-PARCEIRO, não podendo o PROFISSIONAL-PARCEIRO comercializar quaisquer outros produtos sem a prévia e expressa autorização do SALÃO-PARCEIRO.</p>
      {d.cond_comissao_produtos && <>
        <p style={pStyle}><b>Parágrafo Primeiro:</b> O PROFISSIONAL-PARCEIRO terá direito à comissão de {d.cond_comissao_produtos} ({d.cond_comissao_produtos_extenso || "________"}) sobre o valor da venda dos produtos comercializados pelo SALÃO-PARCEIRO, conforme descrito no caput desta cláusula, desde que a venda tenha sido realizada pelo PROFISSIONAL-PARCEIRO.</p>
        <p style={pStyle}><b>Parágrafo Segundo:</b> O pagamento da comissão a que se refere o parágrafo anterior, será feito juntamente com o pagamento da quota-parte do PROFISSIONAL-PARCEIRO, nos termos da Cláusula Quarta deste instrumento.</p>
      </>}
      <p style={pStyle}><b>Cláusula Décima Oitava:</b> Incluem na responsabilidade do PROFISSIONAL-PARCEIRO os custos de correção de serviços mal executados, inclusive com produtos, não tendo o SALÃO-PARCEIRO qualquer responsabilidade reflexa.</p>
      <p style={pStyle}><b>Cláusula Décima Nona:</b> O PROFISSIONAL-PARCEIRO declara estar ciente de que o SALÃO-PARCEIRO possui outros profissionais contratados e se compromete a não promover, em hipótese alguma, disputas, concorrências desleais ou outro tipo de desacordo que desestabilize a harmonia do ambiente, por entender que a parceria deve ser justa e usada com ética entre toda a equipe.</p>
      <p style={pStyle}><b>Cláusula Vigésima:</b> O PROFISSIONAL-PARCEIRO obriga-se a manter a regularidade de sua inscrição perante as autoridades fazendárias, podendo optar entre as qualificações de pequeno empresário, microempresário ou microempreendedor individual.</p>
      <p style={pStyle}><b>Parágrafo Único:</b> O regime previdenciário é de livre escolha do PROFISSIONAL-PARCEIRO.</p>

      <h2 id="pc-7" style={secStyle}>VII – DAS OBRIGAÇÕES DO SALÃO PARCEIRO</h2>
      <p style={pStyle}><b>Cláusula Vigésima Primeira:</b> Cabe ao SALÃO-PARCEIRO a preservação e a manutenção de condições adequadas de trabalho do PROFISSIONAL-PARCEIRO, especialmente no tocante às instalações, possibilitando o cumprimento das normas de segurança e saúde.</p>
      <p style={pStyle}><b>Cláusula Vigésima Segunda:</b> É responsabilidade do SALÃO-PARCEIRO juntamente com o PROFISSIONAL-PARCEIRO a manutenção e higiene de materiais e equipamentos, das condições de funcionamento do negócio e do bom atendimento dos clientes, bem como o cumprimento das normas de saúde e segurança.</p>
      <p style={pStyle}><b>Cláusula Vigésima Terceira:</b> Cabe, exclusivamente, ao SALÃO-PARCEIRO a administração de sua pessoa jurídica e as obrigações e responsabilidades de ordem contábil, fiscal, trabalhista e previdenciária incidentes, ou quaisquer outras relativas ao funcionamento do negócio, não tendo o PROFISSIONAL-PARCEIRO qualquer participação ou responsabilidade quanto a esses aspectos.</p>
      <p style={pStyle}><b>Cláusula Vigésima Quarta:</b> O SALÃO-PARCEIRO compromete-se a administrar de forma competente o recebimento dos valores pagos pelos clientes, mantendo o controle através de documentos (planilhas eletrônicas e livros contábeis) de fácil compreensão, a fim de manter o máximo de transparência e prestar contas sempre que solicitado pelo PROFISSIONAL-PARCEIRO.</p>
      <p style={pStyle}><b>Cláusula Vigésima Quinta:</b> A recepção dos clientes será obrigação do SALÃO-PARCEIRO, o qual deverá manter pessoa capacitada para exercer tal mister, sendo que as obrigações trabalhistas e salariais decorrentes desta obrigação são de responsabilidade única e exclusiva do SALÃO-PARCEIRO, estando os custos incluído em sua quota-parte.</p>
      <p style={pStyle}><b>Cláusula Vigésima Sexta:</b> O SALÃO-PARCEIRO será o único responsável pela retenção e pelo recolhimento junto ao fisco, dos tributos, taxas, contribuições sociais e previdenciárias devidos pelo PROFISSIONAL-PARCEIRO em decorrência da atividade deste na parceria, valor que será descontado sobre a quota-parte do percentual que couber ao PROFISSIONAL-PARCEIRO, nos termos do artigo 1°-A, §3°, da Lei n° 13.352/2016 e conforme pactuado na Cláusula Terceira deste instrumento.</p>

      <h2 id="pc-8" style={secStyle}>VIII – DA PROPAGANDA E DO DIREITO DE IMAGEM</h2>
      <p style={pStyle}><b>Cláusula Vigésima Sétima:</b> Não se incluem nas obrigações do SALÃO-PARCEIRO a propaganda individual do PROFISSIONAL-PARCEIRO ou qualquer outra forma de promoção que não seja atinente tão-somente ao estabelecimento como um todo.</p>
      <p style={pStyle}><b>Parágrafo Primeiro:</b> A publicidade ou propaganda que o SALÃO-PARCEIRO eventualmente vir a fazer para o PROFISSIONAL-PARCEIRO ocorrerá por mera liberalidade, não tendo qualquer obrigação de dar continuidade à mesma.</p>
      <p style={pStyle}><b>Parágrafo Segundo:</b> Para fins de publicidade, o PROFISSIONAL-PARCEIRO cede, neste ato, a título gratuito, os direitos de imagem ao SALÃO-PARCEIRO, ficando este autorizado e livre de qualquer ônus, a utilizar imagens do PROFISSIONAL-PARCEIRO e de seus serviços para fins exclusivos de divulgação e propaganda do estabelecimento como um todo, podendo tanto reproduzir as imagens como divulgá-las em jornais, Internet e redes sociais, TV, bem como em todos os demais meios de comunicação pública ou privada.</p>

      <h2 id="pc-9" style={secStyle}>IX – DA RESPONSABILIDADE POR DANOS A TERCEIROS</h2>
      <p style={pStyle}><b>Cláusula Vigésima Oitava:</b> Os serviços que o PROFISSIONAL-PARCEIRO se propõe a realizar, utilizando-se do equipamento e do espaço, objetos deste contrato, são de sua inteira e exclusiva responsabilidade, declarando, para tanto, ser conhecedor das especificações técnicas dos produtos utilizados, obrigando-se a prestar ao cliente, de forma clara, precisa e adequada, todas as informações necessárias sobre sua correta utilização, especialmente no que se referem à quantidade, características, manuseio, qualidade, preço e risco que representam.</p>
      <p style={pStyle}><b>Parágrafo Primeiro:</b> O PROFISSIONAL-PARCEIRO responderá, perante seus clientes e terceiros, por quaisquer danos, decorrentes de imperícia ou negligência, a que der causa na execução dos serviços objetos deste instrumento, eximindo integralmente o SALÃO-PARCEIRO de qualquer responsabilidade ou ônus.</p>
      <p style={pStyle}><b>Parágrafo Segundo:</b> Nenhuma responsabilidade caberá ao SALÃO-PARCEIRO na relação entre PROFISSIONAL-PARCEIRO e cliente, seja de ordem moral, profissional (qualidade dos serviços) ou outra que implique em responsabilidade civil ou criminal.</p>

      <h2 id="pc-10" style={secStyle}>X – DA INEXISTÊNCIA DE VÍNCULO EMPREGATÍCIO OU SOCIETÁRIO</h2>
      <p style={pStyle}><b>Cláusula Vigésima Nona:</b> Não constitui o presente contrato qualquer relação jurídica de emprego ou de sociedade entre SALÃO-PARCEIRO e PROFISSIONAL-PARCEIRO, estando plenamente resguardada a autonomia do PROFISSIONAL-PARCEIRO na prática de sua atividade profissional, nos moldes da Lei n° 13.352, de 27 de outubro de 2016.</p>
      <p style={pStyle}><b>Cláusula Trigésima:</b> Não existem hierarquia ou subordinação na relação entre PROFISSIONAL-PARCEIRO e SALÃO-PARCEIRO, devendo as partes tratar-se com consideração e respeito recíprocos, atuando em regime de colaboração mútua.</p>

      <h2 id="pc-11" style={secStyle}>XI – DO PRAZO DE VIGÊNCIA E RESCISÃO CONTRATUAL</h2>
      <p style={pStyle}><b>Cláusula Trigésima Primeira:</b> O presente contrato passa a vigorar a partir da data de sua assinatura e possui prazo de vigência de 12 meses, podendo ser rescindido unilateralmente por qualquer das partes, a qualquer tempo, sem prejuízo quanto à responsabilidade legal e contratual aplicáveis, desde que haja prévio aviso, por escrito, com antecedência mínima de 30 (trinta) dias.</p>
      <p style={pStyle}><b>Cláusula Trigésima Segunda:</b> O presente contrato poderá ser rescindido por qualquer das Partes, independentemente de aviso ou notificações, nos seguintes casos:</p>
      <p style={pStyle}>a) Houver danos físicos, morais ou patrimoniais praticados por uma parte à outra, aos clientes ou ao estabelecimento;</p>
      <p style={pStyle}>b) Prática, por qualquer das partes, de ato ilícito, civil ou penal, ou qualquer tipo de constrangimento físico ou moral grave aos clientes, que venha a comprometer o nome do estabelecimento ou da Parte, incluindo neste item o descaso e a desídia com seus clientes.</p>
      <p style={pStyle}><b>Cláusula Trigésima Terceira:</b> Nenhuma das partes será responsável perante a outra por qualquer falha ou atraso no desempenho de qualquer das obrigações assumidas e constantes do presente, desde que causados por evento de força maior ou de caso fortuito, quando tais eventos forem, ao mesmo tempo, imprevisíveis e intransponíveis, devendo a parte inadimplente dar ciência à outra, por escrito inclusive via WhatsApp, em até 48 (quarenta e oito) horas da data da ocorrência, fornecendo informações completas sobre o evento.</p>
      <p style={pStyle}><b>Cláusula Trigésima Quarta:</b> Por ocasião da rescisão do presente contrato, seja pelas Cláusulas Trigésima Primeira ou Trigésima Segunda, compromete-se o PROFISSIONAL-PARCEIRO a entregar as instalações do SALÃO-PARCEIRO no mesmo estado em que as recebeu, inclusive os materiais descritos na Cláusula Quinta, responsabilizando-se por qualquer dano que porventura venha a dar causa pelo uso inadequado dos mesmos, autorizando, desde já, o SALÃO-PARCEIRO a proceder ao bloqueio de possíveis créditos seus, como forma de garantia do ressarcimento dos danos causados, ressalvadas as despesas decorrentes do desgaste natural das instalações e dos materiais, que serão de responsabilidade do SALÃO-PARCEIRO.</p>
      <p style={pStyle}><b>Cláusula Trigésima Quinta:</b> Na hipótese de rescisão contratual, tanto pela Cláusula Trigésima Primeira, quanto pela Cláusula Trigésima Segunda, será devido ao PROFISSIONAL-PARCEIRO sua quota-parte percentual relativa aos serviços que tiver realizado até a data do distrato, devendo o SALÃO-PARCEIRO realizar os repasses dos valores devidos no momento da assinatura do instrumento de distrato.</p>

      <h2 id="pc-12" style={secStyle}>XII – DA CESSÃO OU TRANSFERÊNCIA DO CONTRATO</h2>
      <p style={pStyle}><b>Cláusula Trigésima Sexta:</b> O PROFISSIONAL-PARCEIRO declara expressamente reconhecer que foi selecionado, para firmar este instrumento, tendo em vista as suas habilidades profissionais, pelo que não poderá ceder ou transferir, no todo ou em parte, a qualquer título e a quem quer que seja, os seus direitos e/ou obrigações decorrentes deste contrato, ou de qualquer aditamento que venha a ser celebrado entre as partes.</p>

      <h2 id="pc-13" style={secStyle}>XIV - DAS DISPOSIÇÕES GERAIS</h2>
      <p style={pStyle}><b>Cláusula Trigésima Sétima:</b> A Parte que tiver alterado o endereço constante do preâmbulo deste instrumento deverá, imediatamente e por escrito, comunicar o novo endereço a outra Parte.</p>
      <p style={pStyle}><b>Parágrafo Único:</b> Até que seja feita a comunicação a que se refere o caput desta cláusula, serão válidos e eficazes os avisos, comunicações, notificações e interpelações enviadas para o endereço constante do preâmbulo deste contrato.</p>
      <p style={pStyle}><b>Cláusula Trigésima Oitava:</b> As partes se dão plena e geral quitação por quaisquer outros contratos ou obrigações anteriormente pactuadas, os quais, através da assinatura do presente contrato, ficam extintos de pleno direito.</p>
      <p style={pStyle}><b>Cláusula Trigésima Nona:</b> A eventual tolerância à infringência de qualquer das cláusulas desse instrumento ou o não exercício de qualquer direito nele previsto, constituirá mera liberalidade, não implicando em novação ou transação de qualquer espécie.</p>
      <p style={pStyle}><b>Cláusula Quadragésima:</b> O presente contrato rege-se pela Lei n° 13.352, de 27 de outubro de 2016, e demais dispositivos legais pertinentes à espécie, os quais as Partes declaram conhecer e que serão aplicados nas hipóteses em que o presente contrato for omisso.</p>
      <p style={pStyle}><b>Parágrafo Único:</b> Na eventualidade de qualquer disposição deste contrato ser considerada nula, anulável, inválida ou ineficaz, as demais disposições deste instrumento permanecerão em pleno vigor, válidas e exequíveis, devendo as partes negociar um ajuste equânime da disposição considerada nula, anulável, inválida ou ineficaz de modo a assegurar a respectiva validade e exequibilidade.</p>
      <p style={pStyle}><b>Cláusula Quadragésima Primeira:</b> As Partes declaram expressamente que a presente avença atende aos princípios da boa-fé, em cumprimento à função social do contrato, não importando, em hipótese alguma, em abuso de direito, a qualquer título.</p>

      <h2 id="pc-14" style={secStyle}>XV – DA ELEIÇÃO DE FORO</h2>
      <p style={pStyle}><b>Cláusula Quadragésima Segunda:</b> As Partes elegem o foro da cidade de <b>{ph(d.vig_cidade_uf)}</b> - MG, para dirimir quaisquer dúvidas provenientes da execução e cumprimento do presente instrumento, com renúncia expressa a qualquer outro foro, por mais especial ou privilegiado que seja ou que venha a ser.</p>

      <p style={pStyle}>E por estarem justos e contratados, as Partes assinam o presente contrato em 04 (quatro) vias de igual forma e teor, na presença de 02 (duas) testemunhas, sendo que uma das vias irá para os arquivos do sindicato patronal e a outra para o sindicato laboral se existir.</p>

      <p style={pStyle}>{ph(d.vig_cidade_uf)}, {ph(d.vig_dia)} de {ph(d.vig_mes)} de {ph(d.vig_ano)}</p>

      <div style={{ marginTop: 50, display: "flex", justifyContent: "space-between", gap: 40 }}>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>SALÃO-PARCEIRO</b>
        </div>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>PROFISSIONAL-PARCEIRO</b>
        </div>
      </div>

      <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between", gap: 40, fontSize: "10pt" }}>
        <div style={{ flex: 1, borderTop: "1px solid #333", paddingTop: 8 }}>
          Testemunha: ________<br/>Nome: ________<br/>CPF: ________<br/>Identidade: ________
        </div>
        <div style={{ flex: 1, borderTop: "1px solid #333", paddingTop: 8 }}>
          Testemunha: ________<br/>Nome: ________<br/>CPF: ________<br/>Identidade: ________
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT PAPER — ALTERAÇÃO CONTRATUAL INATIVIDADE (Live Preview) ═══ */
function ContractPaperInatividade({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "13pt", color: "#1a365d", borderBottom: "1.5px solid #2b6cb0", paddingBottom: 4, marginTop: 22, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 4, letterSpacing: 0.5, fontWeight: 700 }}>
        {ph(d.alt_numero, "1")}ª ALTERAÇÃO CONTRATUAL
      </h1>
      <p style={{ textAlign: "center", fontWeight: 700, margin: "2pt 0" }}>{ph(d.emp_razao)}</p>
      <p style={{ textAlign: "center", margin: "2pt 0" }}>CNPJ: {ph(d.emp_cnpj)}</p>
      <p style={{ textAlign: "center", margin: "2pt 0 16pt" }}>NIRE: {ph(d.emp_nire)}</p>

      <p id="inat-alteracao" style={pStyle}>
        <b>{ph(d.emp_razao)}</b>, inscrita no CNPJ: {ph(d.emp_cnpj)}, sociedade empresaria limitada, devidamente registrada na JUCEMG sob o n° {ph(d.emp_nire)} em {ph(d.emp_data_registro)}, estabelecida na {ph(d.emp_endereco)}, Cep {ph(d.emp_cep)}, sendo sócia, <b>{ph(d.sc_nome, "________")}</b>, {ph(d.sc_nacionalidade)}, {ph(d.sc_estado_civil)}, {ph(d.sc_profissao)}, nascida em {ph(d.sc_nascimento)}, com documento de identidade {ph(d.sc_rg)}, {ph(d.sc_rg_orgao)}, CPF nº {ph(d.sc_cpf)}, residente e domiciliada na {ph(d.sc_endereco_residencial)}, Cep {ph(d.sc_cep_residencial)}, resolve proceder a presente alteração contratual consolidando as cláusulas do contrato social mediante condições e cláusulas a seguir:
      </p>

      <h2 id="inat-primeira" style={secStyle}>PRIMEIRA</h2>
      <p style={pStyle}>
        Oportunamente a sociedade empresária limitada, comunica à Junta Comercial do Estado de Minas Gerais a paralisação temporária de suas atividades pelo prazo de até {ph(d.inat_prazo_anos, "10")} anos, a partir de {ph(d.inat_data_inicio)}.
      </p>

      {/* ── CONSOLIDAÇÃO ── */}
      <div id="inat-consolidacao" style={{ marginTop: 30, borderTop: "2px solid #1a365d", paddingTop: 16 }}>
        <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 4, fontWeight: 700 }}>
          CONSOLIDAÇÃO DOS ATOS CONSTITUTIVOS
        </h1>
        <p style={{ textAlign: "center", fontWeight: 700, margin: "2pt 0" }}>{ph(d.emp_razao)}</p>
        <p style={{ textAlign: "center", margin: "2pt 0" }}>CNPJ: {ph(d.emp_cnpj)}</p>
        <p style={{ textAlign: "center", margin: "2pt 0 16pt" }}>NIRE: {ph(d.emp_nire)}</p>
      </div>

      <p style={pStyle}>
        A sociedade gira sob a denominação social de <b>{ph(d.emp_razao)}</b>, inscrita no CNPJ: {ph(d.emp_cnpj)}, sociedade empresaria limitada, devidamente registrada na JUCEMG sob o n° {ph(d.emp_nire)} em {ph(d.emp_data_registro)}, estabelecida na {ph(d.emp_endereco)}, Cep {ph(d.emp_cep)}, sendo sócia, <b>{ph(d.sc_nome, "________")}</b>, {ph(d.sc_nacionalidade)}, {ph(d.sc_estado_civil)}, {ph(d.sc_profissao)}, nascida em {ph(d.sc_nascimento)}, com documento de identidade {ph(d.sc_rg)}, {ph(d.sc_rg_orgao)}, CPF nº {ph(d.sc_cpf)}, residente e domiciliada na {ph(d.sc_endereco_residencial)}, Cep {ph(d.sc_cep_residencial)}, temporariamente paralisada pelo período de até {ph(d.inat_prazo_anos, "10")} anos, com início em {ph(d.inat_data_inicio)}.
      </p>

      <h2 id="inat-clausula-1" style={secStyle}>CLÁUSULA PRIMEIRA</h2>
      <p style={pStyle}>A sede da empresa estabelecida na {ph(d.emp_endereco)}, CEP {ph(d.emp_cep)}.</p>

      <h2 id="inat-clausula-2" style={secStyle}>CLÁUSULA SEGUNDA</h2>
      <p style={pStyle}>O objeto social é {ph(d.emp_objeto)}.</p>

      <h2 id="inat-clausula-3" style={secStyle}>CLÁUSULA TERCEIRA</h2>
      <p style={pStyle}>
        O capital social é no valor de R$ {ph(d.cap_valor)} ({ph(d.cap_valor_extenso)}), divididos em {ph(d.cap_num_quotas)} ({ph(d.cap_num_quotas_extenso)}) quotas no valor nominal de R$ {ph(d.cap_valor_quota)} ({ph(d.cap_valor_quota_extenso)}) cada uma, integralizadas em moeda corrente neste ato pelo sócio e distribuindo-se da seguinte forma:
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse", margin: "8pt 0", fontSize: "9pt" }}>
        <thead>
          <tr style={{ background: "#1a365d", color: "#fff" }}>
            <th style={{ padding: 6, border: "1px solid #ccc", textAlign: "left" }}>Sócio</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Quota</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>Valor (R$)</th>
            <th style={{ padding: 6, border: "1px solid #ccc" }}>%</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: 4, border: "1px solid #ccc" }}>{ph(d.sc_nome, "________")}</td>
            <td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>{ph(d.cap_num_quotas)}</td>
            <td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>{ph(d.cap_valor)}</td>
            <td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>100</td>
          </tr>
          <tr style={{ fontWeight: 700 }}>
            <td style={{ padding: 4, border: "1px solid #ccc" }}>Total</td>
            <td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>{ph(d.cap_num_quotas)}</td>
            <td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>{ph(d.cap_valor)}</td>
            <td style={{ padding: 4, border: "1px solid #ccc", textAlign: "center" }}>100</td>
          </tr>
        </tbody>
      </table>

      <h2 id="inat-clausula-4" style={secStyle}>CLÁUSULA QUARTA</h2>
      <p style={pStyle}>A responsabilidade de cada sócio é restrita ao valor de suas quotas, mas todos respondem solidariamente pela integralização do capital social, conforme art. 1.052 CC/2002.</p>

      <h2 id="inat-clausula-5" style={secStyle}>CLÁUSULA QUINTA</h2>
      <p style={pStyle}>A administração da sociedade será exercida pelo sócio; <b>{ph(d.sc_nome, "________")}</b>, respondendo pela empresa, judicial e extrajudicialmente, em juízo ou fora dele, em conjunto ou individual, podendo praticar todos os atos compreendidos no objeto social, sempre no interesse da sociedade, ficando vedado o uso da denominação social em negócios estranhos aos fins sociais, bem como onerar bens imóveis da sociedade, sem autorização do outro sócio.</p>

      <h2 id="inat-clausula-6" style={secStyle}>CLÁUSULA SEXTA</h2>
      <p style={pStyle}>As atividades iniciaram em {ph(d.emp_data_inicio_atividades)} e o prazo de duração da sociedade será por tempo indeterminado.</p>

      <h2 id="inat-clausula-7" style={secStyle}>CLÁUSULA SÉTIMA</h2>
      <p style={pStyle}>As quotas são indivisíveis e não poderão ser cedidas ou transferidas no todo ou em parte a terceiros, sem expresso consentimento do outro sócio, a quem fica assegurado, em igualdade de condições e preço, direito de preferência para a sua aquisição, formalizando, se realizada a cessão delas, a alteração contratual pertinente.</p>

      <h2 id="inat-clausula-8" style={secStyle}>CLÁUSULA OITAVA</h2>
      <p style={pStyle}>Que a empresa poderá a qualquer tempo, abrir ou fechar filiais, em qualquer parte do país, se assim, em conjunto, decidirem os sócios em conjunto, mediante alteração contratual assinada por todos os sócios.</p>

      <h2 id="inat-clausula-9" style={secStyle}>CLÁUSULA NONA</h2>
      <p style={pStyle}>Que o exercício social coincidirá com o ano civil. Ao término de cada exercício, o administrador prestará contas justificadas de sua administração, procedendo à elaboração das demonstrações financeiras, cabendo aos sócios, na proporção de suas quotas, os lucros ou perdas apurados.</p>

      <h2 id="inat-clausula-10" style={secStyle}>CLÁUSULA DÉCIMA</h2>
      <p style={pStyle}>Em caso de morte de um dos sócios, a sociedade não será dissolvida e continuará sendo gerida pelo sócio remanescente ou pelos herdeiros. Não sendo possível ou inexistindo interesse destes ou do sócio remanescente, os valores de seus haveres serão apurados e liquidados com base na situação patrimonial da empresa. O mesmo procedimento será adotado em qualquer dos casos em que a sociedade se resolva em relação a um dos sócios.</p>

      <h2 id="inat-clausula-11" style={secStyle}>CLÁUSULA DÉCIMA PRIMEIRA</h2>
      <p style={pStyle}>Pode o sócio ser excluído, quando a maioria dos sócios, representativa de mais da metade do capital social, entender que um ou mais sócios estão pondo em risco a continuidade da empresa, em virtude de atos graves e que configurem justa causa segundo artigo 1.085 do CC/2002.</p>

      <h2 id="inat-clausula-12" style={secStyle}>CLÁUSULA DÉCIMA SEGUNDA</h2>
      <p style={pStyle}>Que os administradores declaram, sob as penas da lei, que não estão incursos em quaisquer crimes previstos em lei ou restrições legais, que possam impedi-los de exercer atividade empresarial conforme artigo 1.011, 1º do CC/2002.</p>

      <h2 id="inat-clausula-13" style={secStyle}>CLÁUSULA DÉCIMA TERCEIRA</h2>
      <p style={pStyle}>As partes elegem o foro de {ph(d.vig_foro)} para dirimir quaisquer dúvidas decorrente do presente instrumento contratual, bem como para o exercício e cumprimento dos direitos e obrigações resultantes deste contrato, sendo que os administradores renunciam a qualquer outro, por mais privilegiado que possa ser.</p>

      <p style={pStyle}>E, por estarem justos e contratados, assinam digitalmente o presente instrumento particular em uma via.</p>

      <p style={pStyle}>{ph(d.vig_local_data, "Belo Horizonte, __ de ________ de ____")}</p>

      <div style={{ marginTop: 50 }}>
        <div style={{ width: "50%", textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{ph(d.sc_nome, "________")}</b><br />
          SOCIA ADMINISTRADORA
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT PAPER — ALTERAÇÃO CONTRATUAL (Live Preview) ═══ */
function ContractPaperAlteracao({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "13pt", color: "#1a365d", borderBottom: "1.5px solid #2b6cb0", paddingBottom: 4, marginTop: 22, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };
  const cellStyle = { padding: 4, border: "1px solid #ccc" };
  const cellCenter = { ...cellStyle, textAlign: "center" };

  const enqTexto = d.enq_porte === "EPP" ? "inciso II" : "inciso I";
  const porteTxt = d.enq_porte === "EPP" ? "EPP" : "ME";

  const TabelaQuotas = () => (
    <table style={{ width: "100%", borderCollapse: "collapse", margin: "8pt 0", fontSize: "9pt" }}>
      <thead>
        <tr style={{ background: "#1a365d", color: "#fff" }}>
          <th style={{ padding: 6, border: "1px solid #ccc", textAlign: "left" }}>Sócio</th>
          <th style={{ padding: 6, border: "1px solid #ccc" }}>Quotas</th>
          <th style={{ padding: 6, border: "1px solid #ccc" }}>Valor Nominal (R$)</th>
          <th style={{ padding: 6, border: "1px solid #ccc" }}>Total (R$)</th>
          <th style={{ padding: 6, border: "1px solid #ccc" }}>%</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={cellStyle}>{ph(d.sc1_nome && d.sc1_nome.toUpperCase())}</td>
          <td style={cellCenter}>{ph(d.dist_sc1_quotas)}</td>
          <td style={cellCenter}>{ph(d.cap_valor_quota)}</td>
          <td style={cellCenter}>{ph(d.dist_sc1_total)}</td>
          <td style={cellCenter}>{ph(d.dist_sc1_percentual)}</td>
        </tr>
        <tr>
          <td style={cellStyle}>{ph(d.sc2_nome && d.sc2_nome.toUpperCase())}</td>
          <td style={cellCenter}>{ph(d.dist_sc2_quotas)}</td>
          <td style={cellCenter}>{ph(d.cap_valor_quota)}</td>
          <td style={cellCenter}>{ph(d.dist_sc2_total)}</td>
          <td style={cellCenter}>{ph(d.dist_sc2_percentual)}</td>
        </tr>
        <tr style={{ fontWeight: 700 }}>
          <td style={cellStyle}>Total</td>
          <td style={cellCenter}>{ph(d.cap_num_quotas)}</td>
          <td style={cellCenter}>{ph(d.cap_valor_quota)}</td>
          <td style={cellCenter}>{ph(d.cap_valor)}</td>
          <td style={cellCenter}>100</td>
        </tr>
      </tbody>
    </table>
  );

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 id="alt-cabecalho" style={{ fontSize: "14pt", textAlign: "center", marginBottom: 4, letterSpacing: 0.5, fontWeight: 700 }}>
        {ph(d.alt_numero, "1")}ª ALTERAÇÃO CONTRATUAL
      </h1>
      <p style={{ textAlign: "center", fontWeight: 700, margin: "2pt 0" }}>{ph(d.emp_razao)}</p>
      <p style={{ textAlign: "center", margin: "2pt 0" }}>CNPJ Nº {ph(d.emp_cnpj)}</p>
      <p style={{ textAlign: "center", margin: "2pt 0 16pt" }}>NIRE Nº {ph(d.emp_nire)} em {ph(d.emp_data_registro)}</p>

      <p style={pStyle}>
        <b>{ph(d.sc1_nome && d.sc1_nome.toUpperCase(), "________")}</b>, {ph(d.sc1_nacionalidade)}, {ph(d.sc1_estado_civil)}, {ph(d.sc1_profissao)}, nascido em {ph(d.sc1_nascimento)}, portador do CPF n°. {ph(d.sc1_cpf)} e documento de identidade n°. {ph(d.sc1_rg)}, {ph(d.sc1_rg_orgao)}, com residência a {ph(d.sc1_endereco)}, CEP: {ph(d.sc1_cep)};
      </p>

      <p style={pStyle}>
        <b>{ph(d.sc2_nome && d.sc2_nome.toUpperCase(), "________")}</b>, {ph(d.sc2_nacionalidade)}, {ph(d.sc2_estado_civil)}, {ph(d.sc2_profissao)}, nascida em {ph(d.sc2_nascimento)}, documento de identidade nº {ph(d.sc2_rg)}, {ph(d.sc2_rg_orgao)} e do CPF nº {ph(d.sc2_cpf)}, residente na {ph(d.sc2_endereco)}, CEP: {ph(d.sc2_cep)}, únicos sócios da sociedade empresaria limitada, denominada, <b>{ph(d.emp_razao)}</b>, inscrita no CNPJ sob o nº {ph(d.emp_cnpj)} e registrada na Junta Comercial do Estado de Minas Gerais sob o NIRE nº {ph(d.emp_nire)} em {ph(d.emp_data_registro)}, com sede na {ph(d.emp_endereco)}, CEP: {ph(d.emp_cep)}, resolvem alterar e consolidar o contrato social, conforme clausulas e condições a seguir:
      </p>

      <h2 id="alt-clausula-1" style={secStyle}>CLAUSULA PRIMEIRA</h2>
      <p style={pStyle}>
        A sócia <b>{ph(d.ces_cedente && d.ces_cedente.toUpperCase(), "________")}</b>, já qualificada acima, cede e transfere {ph(d.ces_percentual)} ({ph(d.ces_percentual_extenso)}) de suas quotas para o sócio <b>{ph(d.ces_cessionario && d.ces_cessionario.toUpperCase(), "________")}</b>, já qualificado acima, ficando distribuído da seguinte forma:
      </p>
      <p style={pStyle}>
        <b>{ph(d.sc1_nome && d.sc1_nome.toUpperCase(), "________")}</b>, passa a possuir {ph(d.dist_sc1_quotas)}({ph(d.dist_sc1_quotas_extenso)}) quotas no valor nominal de R${ph(d.cap_valor_quota)}({ph(d.cap_valor_quota_extenso)}) cada, totalizando R${ph(d.dist_sc1_total)}({ph(d.dist_sc1_total_extenso)}), que corresponde a {ph(d.dist_sc1_percentual)}% do capital social, já integralizado em moeda corrente do país.
      </p>
      <p style={pStyle}>
        <b>{ph(d.sc2_nome && d.sc2_nome.toUpperCase(), "________")}</b>, passa a possuir {ph(d.dist_sc2_quotas)}({ph(d.dist_sc2_quotas_extenso)}) quotas no valor nominal de R${ph(d.cap_valor_quota)}({ph(d.cap_valor_quota_extenso)}) cada, totalizando R${ph(d.dist_sc2_total)}({ph(d.dist_sc2_total_extenso)}), que corresponde a {ph(d.dist_sc2_percentual)}% do capital social, já integralizado em moeda corrente do país.
      </p>

      {/* ── CONSOLIDAÇÃO ── */}
      <div id="alt-consolidacao" style={{ marginTop: 30, borderTop: "2px solid #1a365d", paddingTop: 16 }}>
        <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 4, fontWeight: 700 }}>
          CONSOLIDAÇÃO DOS ATOS CONSTITUTIVOS
        </h1>
        <p style={{ textAlign: "center", fontWeight: 700, margin: "2pt 0" }}>{ph(d.emp_razao)}</p>
        <p style={{ textAlign: "center", margin: "2pt 0" }}>CNPJ Nº {ph(d.emp_cnpj)}</p>
        <p style={{ textAlign: "center", margin: "2pt 0 16pt" }}>NIRE Nº {ph(d.emp_nire)} EM {ph(d.emp_data_registro)}</p>
      </div>

      <p style={pStyle}>
        <b>{ph(d.sc1_nome && d.sc1_nome.toUpperCase(), "________")}</b>, {ph(d.sc1_nacionalidade)}, {ph(d.sc1_profissao)}, {ph(d.sc1_estado_civil)}, nascido em {ph(d.sc1_nascimento)}, portador do CPF n°. {ph(d.sc1_cpf)} e documento de identidade n°. {ph(d.sc1_rg)}, {ph(d.sc1_rg_orgao)}, com residência a {ph(d.sc1_endereco)}, CEP: {ph(d.sc1_cep)};
      </p>
      <p style={pStyle}>
        <b>{ph(d.sc2_nome && d.sc2_nome.toUpperCase(), "________")}</b>, {ph(d.sc2_nacionalidade)}, {ph(d.sc2_estado_civil)}, {ph(d.sc2_profissao)}, nascida em {ph(d.sc2_nascimento)}, documento de identidade nº {ph(d.sc2_rg)}, {ph(d.sc2_rg_orgao)} e do CPF nº {ph(d.sc2_cpf)}, residente na {ph(d.sc2_endereco)}, CEP: {ph(d.sc2_cep)}, únicos sócios da sociedade empresaria limitada, denominada, <b>{ph(d.emp_razao)}</b>, inscrita no CNPJ sob o nº {ph(d.emp_cnpj)} e registrada na Junta Comercial do Estado de Minas Gerais sob o NIRE nº {ph(d.emp_nire)} em {ph(d.emp_data_registro)}, com sede na {ph(d.emp_endereco)}, CEP: {ph(d.emp_cep)}, consolidam o contrato social, conforme clausulas e condições a seguir:
      </p>

      <h2 id="alt-cons-1" style={secStyle}>CLAUSULA PRIMEIRA</h2>
      <p style={pStyle}>A sociedade empresária limitada, tem prazo de duração por tempo indeterminado e adota o nome empresarial de <b>{ph(d.emp_razao)}</b> e nome fantasia: <b>{ph(d.emp_nome_fantasia)}</b>.</p>

      <h2 id="alt-cons-2" style={secStyle}>CLAUSULA SEGUNDA</h2>
      <p style={pStyle}>Sede na {ph(d.emp_endereco)}, CEP: {ph(d.emp_cep)}.</p>

      <h2 id="alt-cons-3" style={secStyle}>CLÁUSULA TERCEIRA</h2>
      <p style={pStyle}>O objeto social é {ph(d.emp_objeto)}.</p>

      <h2 id="alt-cons-4" style={secStyle}>CLÁUSULA QUARTA</h2>
      <p style={pStyle}>
        O Capital Social desta sociedade será no valor de R$ {ph(d.cap_valor)} ({ph(d.cap_valor_extenso)}), dividido em {ph(d.cap_num_quotas)} ({ph(d.cap_num_quotas_extenso)}) quotas no valor de R$ {ph(d.cap_valor_quota)} ({ph(d.cap_valor_quota_extenso)}) cada uma, totalizando R$ {ph(d.cap_valor)} ({ph(d.cap_valor_extenso)}) em moeda corrente do País e distribuído da seguinte forma:
      </p>
      <p style={pStyle}>
        <b>{ph(d.sc1_nome && d.sc1_nome.toUpperCase(), "________")}</b>, possuidor de {ph(d.dist_sc1_quotas)}({ph(d.dist_sc1_quotas_extenso)}) quotas no valor nominal de R${ph(d.cap_valor_quota)}({ph(d.cap_valor_quota_extenso)}) cada, totalizando R${ph(d.dist_sc1_total)}({ph(d.dist_sc1_total_extenso)}), que corresponde a {ph(d.dist_sc1_percentual)}% do capital social, já integralizado em moeda corrente do país.
      </p>
      <p style={pStyle}>
        <b>{ph(d.sc2_nome && d.sc2_nome.toUpperCase(), "________")}</b>, possuidora de {ph(d.dist_sc2_quotas)}({ph(d.dist_sc2_quotas_extenso)}) quotas no valor nominal de R${ph(d.cap_valor_quota)}({ph(d.cap_valor_quota_extenso)}) cada, totalizando R${ph(d.dist_sc2_total)}({ph(d.dist_sc2_total_extenso)}), que corresponde a {ph(d.dist_sc2_percentual)}% do capital social, já integralizado em moeda corrente do país.
      </p>

      <h2 id="alt-cons-5" style={secStyle}>CLÁUSULA QUINTA</h2>
      <p style={pStyle}>A administração da sociedade caberá ao sócio, <b>{ph(d.adm_nome && d.adm_nome.toUpperCase(), "________")}</b>, já qualificado acima, onde assinará isoladamente, com os poderes e atribuições de representação ativa e passiva, judicial e extrajudicial, podendo praticar todos os atos compreendidos no objeto.</p>

      <h2 id="alt-cons-6" style={secStyle}>CLÁUSULA SEXTA</h2>
      <p style={pStyle}>Ao término de cada exercício social, em 31 de dezembro, proceder-se-á a elaboração do inventário, do balanço patrimonial e do balanço de resultado econômico.</p>
      <p style={pStyle}><b>Parágrafo único</b> – Poderão os sócios durante o decorrer do exercício social, levantar balanços e/ou balancetes parciais e seus resultados tratando-se de lucros e/ou perdas, poderão ser distribuídas as sócias, proporcionalmente às suas quotas ou de forma convencionada entre elas.</p>

      <h2 id="alt-cons-7" style={secStyle}>CLÁUSULA SÉTIMA</h2>
      <p style={pStyle}>A sociedade poderá a qualquer tempo, abrir ou fechar filial ou outra dependência, mediante ato de alteração do ato constitutivo.</p>

      <h2 id="alt-cons-8" style={secStyle}>CLÁUSULA OITAVA</h2>
      <p style={pStyle}>Os sócios declaram, sob as penas da lei, de que não estão impedidos de exercerem a administração da sociedade, por lei especial, ou em virtude de condenação criminal, ou por se encontrarem sob os efeitos dela, a pena que vede, ainda que temporariamente, o acesso a cargos públicos; ou por crime falimentar, de prevaricação, peita ou suborno, concussão, peculato, ou contra a economia popular, contra o sistema financeiro nacional, contra normas de defesa da concorrência, contra as relações de consumo, fé pública, ou a propriedade.</p>

      <h2 id="alt-cons-9" style={secStyle}>CLÁUSULA NONA</h2>
      <p style={pStyle}>A sociedade não se dissolverá por morte ou retirada de qualquer dos sócios, podendo continuar com os sucessores ou herdeiros do sócio retirante ou falecido, devendo ser levantado balanço especial na ocasião e verificado o crédito e ser assentada a participação dos sucessores ou herdeiros na sociedade.</p>

      <h2 id="alt-cons-10" style={secStyle}>CLÁUSULA DÉCIMA</h2>
      <p style={pStyle}>Os sócios que desejarem retirar-se da sociedade deverá comunicar ao outro por escrito e decorrido o prazo de 30 (trinta) dias, após a comunicação seus, haveres serão apurados e pagos de acordo com o estabelecido na ocasião.</p>

      <h2 id="alt-cons-11" style={secStyle}>CLÁUSULA DÉCIMA PRIMEIRA</h2>
      <p style={pStyle}>Nenhum dos sócios poderá ceder ou transferir suas quotas de capital a terceiros no todo ou em partes, sem o consentimento do outro sócio, cabendo-lhes a este o direito de preferência para a aquisição em igualdade de condições.</p>

      <h2 id="alt-cons-12" style={secStyle}>CLÁUSULA DÉCIMA SEGUNDA</h2>
      <p style={pStyle}>O Administrador declara, sob as penas da Lei, que não estar impedido de exercer a administração da sociedade, por Lei especial, ou em virtude de condenação criminal, ou por se encontrar sob os efeitos dela, a pena que vede ainda que temporariamente, o acesso a cargos públicos; ou por crime falimentar de prevaricação, peita ou suborno, concussão, peculato, ou contra a economia popular, contra o sistema financeiro nacional, contra normas de defesa de concorrência, contra as relações de consumo, fé pública ou a propriedade.</p>

      <h2 id="alt-cons-13" style={secStyle}>CLÁUSULA DÉCIMA TERCEIRA</h2>
      <p style={pStyle}>Os signatários do presente ato declaram, sob as penas da lei que a empresa se enquadra na situação de {porteTxt} e que o movimento da receita bruta anual da empresa não excederá o limite fixado no {enqTexto} do art. 3° da Lei Complementar nº 123 de 14 de dezembro de 2006, e que não se enquadram em qualquer das hipóteses de exclusão relacionadas no § 4º do art. 3º da mencionada lei.</p>

      <h2 id="alt-cons-14" style={secStyle}>CLÁUSULA DÉCIMA QUARTA</h2>
      <p style={pStyle}>Fica eleito o foro da comarca de {ph(d.vig_foro)} para dirimir as dúvidas oriundas na interpretação do presente instrumento.</p>

      <p style={pStyle}>E, por assim estarem justos e contratados assinam digitalmente o presente Contrato Social.</p>

      <p style={pStyle}>{ph(d.vig_local_data, "Belo Horizonte, __ de ________ de ____")}</p>

      <div style={{ marginTop: 50, display: "flex", justifyContent: "space-between", gap: 40 }}>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{ph(d.sc1_nome && d.sc1_nome.toUpperCase(), "________")}</b>
        </div>
        <div style={{ flex: 1, textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{ph(d.sc2_nome && d.sc2_nome.toUpperCase(), "________")}</b>
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT PAPER — TERMO DE DISTRATO (Live Preview) ═══ */
function ContractPaperDistrato({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "12pt", color: "#1a365d", marginTop: 20, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 20, letterSpacing: 0.5, fontWeight: 700 }}>
        TERMO DE DISTRATO
      </h1>

      <p id="dist-partes" style={pStyle}>As PARTES a seguir qualificadas:</p>

      <p style={pStyle}>
        <b>{ph(d.ct_razao)}</b> (CONTRATANTE), pessoa jurídica inscrita no CNPJ sob o nº {ph(d.ct_cnpj)}, situada à {ph(d.ct_endereco)}, CEP {ph(d.ct_cep)}; e,
      </p>

      <p style={pStyle}>
        <b>{ph(d.cd_razao)}</b> (CONTRATADA), pessoa jurídica inscrita no CNPJ sob o nº {ph(d.cd_cnpj)}, situada à {ph(d.cd_endereco)}, CEP {ph(d.cd_cep)}.
      </p>

      <h2 id="dist-considerando" style={secStyle}>CONSIDERANDO QUE:</h2>

      <p style={pStyle}>
        Em {ph(d.orig_data_celebracao)}, Contratante e Contratado, celebraram Contrato nos termos da {ph(d.orig_lei)} (CONTRATO), por prazo indeterminado, cujo objeto é {ph(d.orig_objeto)};
      </p>

      <p style={pStyle}>
        A relação de parceria entre ambas as pessoas jurídicas sempre se ateve às normas vigentes, em especial a {ph(d.orig_lei_nome)}.
      </p>

      <p style={pStyle}>Resolvem em um acordo, para não dar continuidade à relação de parceria vigente;</p>

      <h2 id="dist-resolvem" style={secStyle}>RESOLVEM, em comum acordo, por meio deste Termo de Distrato:</h2>

      <p style={pStyle}>
        Registrar o encerramento regular do Contrato de Parceria celebrado entre Contratante e Contratado, desde o dia {ph(d.dist_data_encerramento)}, sem que haja qualquer valor devido de parte a parte.
      </p>

      <p style={pStyle}>Registrar que durante todo o período de vigência do contrato, as normas legais e pactuadas entre as partes foram regularmente cumpridas.</p>

      <p style={pStyle}>Registrar que todos os repasses financeiros devidos foram realizados.</p>

      <p style={pStyle}>Registrar que todos os instrumentos de trabalho foram devolvidos.</p>

      <h2 id="dist-declaram" style={secStyle}>E assim, em face ao exposto DECLARAM as PARTES:</h2>

      <p style={pStyle}>
        I – Plenamente satisfeitas com o direito, as obrigações e os deveres do contrato de parceria, que ora rescindem, atestando o seu fiel cumprimento, para nada mais reclamar em juízo ou fora dele, a qualquer título, conferindo ambos plena, geral e irrestrita quitação e extinta a relação jurídica, inclusive quanto a eventuais danos materiais e morais, nada mais tendo a requerer a qualquer título e sob qualquer pretexto.
      </p>

      <p style={pStyle}>
        E, por estarem assim justas e contratadas, assinam o presente Termo em 2 (duas) vias de igual teor e forma, e para um só efeito legal, na presença de 2 (duas) testemunhas.
      </p>

      <p style={pStyle}>{ph(d.vig_local_data, "Belo Horizonte, __ de ________ de ____")}</p>

      <div id="dist-assinaturas" style={{ marginTop: 40 }}>
        <div style={{ borderTop: "1px solid #333", paddingTop: 8, marginBottom: 24, width: "70%" }}>
          <b>{ph(d.ct_razao)}</b><br />CNPJ: {ph(d.ct_cnpj)}
        </div>
        <div style={{ borderTop: "1px solid #333", paddingTop: 8, marginBottom: 24, width: "70%" }}>
          <b>{ph(d.cd_razao)}</b><br />CNPJ: {ph(d.cd_cnpj)}
        </div>
      </div>

      <p style={{ marginTop: 30, fontWeight: 700 }}>TESTEMUNHAS:</p>
      <div style={{ display: "flex", gap: 40, marginTop: 20 }}>
        <div style={{ flex: 1, borderTop: "1px solid #333", paddingTop: 8 }}>
          Nome: {ph(d.test1_nome)}<br />CPF: {ph(d.test1_cpf)}
        </div>
        <div style={{ flex: 1, borderTop: "1px solid #333", paddingTop: 8 }}>
          Nome: {ph(d.test2_nome)}<br />CPF: {ph(d.test2_cpf)}
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT PAPER — COMUNICAÇÃO DE PARALISAÇÃO (Live Preview) ═══ */
function ContractPaperParalisacao({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>
      <h1 style={{ fontSize: "14pt", textAlign: "center", marginBottom: 6, letterSpacing: 0.5, fontWeight: 700 }}>
        COMUNICAÇÃO DE PARALISAÇÃO TEMPORÁRIA DE ATIVIDADES
      </h1>
      <p id="par-comunicacao" style={{ textAlign: "center", fontSize: "12pt", fontWeight: 700, color: "#1a365d", marginBottom: 24 }}>
        SOCIEDADE EMPRESÁRIA
      </p>

      <p style={{ textAlign: "center", fontSize: "13pt", fontWeight: 700, marginBottom: 8 }}>{ph(d.emp_razao)}</p>

      <p style={pStyle}>{ph(d.emp_endereco)}, CEP: {ph(d.emp_cep)},</p>

      <p style={pStyle}>
        NIRE Nº {ph(d.emp_nire)}, em {ph(d.emp_data_registro)} e CNPJ nº {ph(d.emp_cnpj)}, comunica à JUNTA COMERCIAL DO ESTADO DE MINAS GERAIS, que paralisará temporariamente, suas atividades, pelo prazo de até {ph(d.par_prazo_anos, "10")}({ph(d.par_prazo_extenso, "dez")}) anos, com início em {ph(d.par_data_inicio)}.
      </p>

      <p style={pStyle}>Declara ainda, os seguintes dados:</p>

      <p id="par-objeto" style={pStyle}>a) O objeto da sociedade é {ph(d.emp_objeto)}.</p>

      <p id="par-capital" style={pStyle}>
        b) O capital da sociedade é de R${ph(d.cap_valor)}({ph(d.cap_valor_extenso)}), dividido em {ph(d.cap_num_quotas)} ({ph(d.cap_num_quotas_extenso)}) quotas no valor de R${ph(d.cap_valor_quota)}({ph(d.cap_valor_quota_extenso)}) cada uma e distribuídas para o sócio, conforme indicação feita abaixo, no fecho desta COMUNICAÇÃO.
      </p>

      <p id="par-admin" style={pStyle}>c) A sociedade é administrada pela sócia, <b>{ph(d.adm_nome)}</b>.</p>

      <p id="par-prazo" style={pStyle}>d) A sociedade tem o prazo de duração indeterminado e início das atividades foi em {ph(d.emp_data_inicio_atividades)}.</p>

      {d.fil_endereco && (
        <p id="par-filial" style={pStyle}>
          e) A sociedade tem filial no seguinte endereço: {d.fil_endereco}, CEP: {ph(d.fil_cep)}, registrada sob o NIRE nº {ph(d.fil_nire)} em {ph(d.fil_data_registro)}.
        </p>
      )}

      <p id="par-socio" style={pStyle}>{d.fil_endereco ? "F" : "e"}) Dados dos sócios:</p>

      <p style={pStyle}>
        <b>{ph(d.sc_nome)}</b>, {ph(d.sc_nacionalidade)}, {ph(d.sc_estado_civil)}, {ph(d.sc_profissao)}, nascida em {ph(d.sc_nascimento)}, com documento de identidade {ph(d.sc_rg)}, {ph(d.sc_rg_orgao)}, CPF nº {ph(d.sc_cpf)}, residente e domiciliada na {ph(d.sc_endereco)}, Cep {ph(d.sc_cep)} e possuidora de {ph(d.sc_quotas)} ({ph(d.sc_quotas_extenso)}), quotas no capital social.
      </p>

      <p id="par-assinatura" style={pStyle}>{ph(d.vig_local_data, "Belo Horizonte, __/__/____")}</p>

      <div style={{ marginTop: 50 }}>
        <div style={{ width: "50%", textAlign: "center", borderTop: "1px solid #333", paddingTop: 10 }}>
          <b>{ph(d.sc_nome)}</b><br />
          CPF: {ph(d.sc_cpf)}
        </div>
      </div>

      <p style={{ marginTop: 50, fontSize: "9pt", color: C.light }}>Autenticação (para uso exclusivo da JUCEMG)</p>
    </div>
  );
}

function ContractPaperAlteracaoEssencial({ data }) {
  const d = data;
  const ph = (val, fallback = "________") => val || <span style={{ color: C.light, fontStyle: "italic" }}>{fallback}</span>;
  const secStyle = { fontSize: "13pt", color: "#1a365d", borderBottom: "1pt solid #2b6cb0", paddingBottom: 4, marginTop: 16, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" };
  const pStyle = { textAlign: "justify", margin: "6pt 0", lineHeight: 1.7 };

  return (
    <div style={{ fontFamily: "'Times New Roman', serif", fontSize: "11pt", color: C.text, padding: "40px 50px" }}>

      {/* ── PARTE 1: TRANSFORMAÇÃO ── */}
      <p style={{ textAlign: "center", fontSize: "12pt", fontWeight: 700, marginBottom: 4 }}>{ph(d.emp_razao_anterior)}</p>
      <p style={{ textAlign: "center", fontSize: "11pt", marginBottom: 2 }}>CNPJ {ph(d.emp_cnpj)}</p>
      <p style={{ textAlign: "center", fontSize: "11pt", marginBottom: 2 }}>NIRE {ph(d.emp_nire)}</p>
      <p style={{ textAlign: "center", fontSize: "11pt", marginBottom: 20 }}>EM {ph(d.emp_data_registro)}</p>

      <h1 id="ae-transformacao" style={{ fontSize: "14pt", textAlign: "center", marginBottom: 20, letterSpacing: 0.5, fontWeight: 700 }}>
        TRANSFORMAÇÃO EM SOCIEDADE EMPRESARIA LIMITADA
      </h1>

      <p style={pStyle}>
        <b>{ph(d.emp_razao_anterior)}</b>, empresario individual, inscrita no CNPJ sob nº {ph(d.emp_cnpj)}, registro no Conselho Regional de Contabilidade sob nº {ph(d.emp_crc)}, estabelecida à {ph(d.emp_endereco)}, CEP {ph(d.emp_cep)}, representada pela unica sócia, {ph(d.sc_nome)}, {ph(d.sc_nacionalidade)}, {ph(d.sc_estado_civil)}, {ph(d.sc_profissao)}, nascida em {ph(d.sc_nascimento)}, natural de {ph(d.sc_naturalidade)}, portadora da Cédula de Identidade RG n° {ph(d.sc_rg)}, {ph(d.sc_rg_orgao)}, inscrita no CPF sob n° {ph(d.sc_cpf)}, inscrita no Conselho Regional de Contabilidade, sob nº {ph(d.sc_crc)}, residente à {ph(d.sc_endereco)}, registrada na Junta Comercial de Minas Gerais sob o NIRE nº {ph(d.emp_nire)} em {ph(d.emp_data_registro)} e alteração arquivada sob nº {ph(d.alt_numero)} em {ph(d.alt_data)}, resolve neste ato fazer a Transformação de empresario individual para Sociedade empresária limitada, regida por este Contrato Social, pelas disposições legais aplicáveis às sociedades limitadas na Lei Federal 10.406 de 10 de janeiro de 2002, conforme cláusulas a seguir:
      </p>

      <h2 id="ae-denominacao" style={secStyle}>CAPÍTULO I — DENOMINAÇÃO, SEDE E OBJETO</h2>

      <p style={pStyle}><b>Cláusula 1.</b> Transformação da empresario individual em uma Sociedade empresária Limitada.</p>

      <p style={pStyle}><b>Cláusula 2.</b> Alteração sua razão social para <b>{ph(d.emp_razao_nova)}</b>, e mantem seu nome fantasia, <b>{ph(d.emp_nome_fantasia)}</b>.</p>

      <p style={pStyle}><b>Cláusula 3.</b> A sociedade continua na sua sede e foro na {ph(d.emp_endereco)}, CEP. {ph(d.emp_cep)}, e poderá abrir e encerrar filiais, em qualquer localidade do País.</p>

      <p id="ae-objeto-transf" style={pStyle}><b>Cláusula 4.</b> O objeto social é {ph(d.emp_objeto)}.</p>

      {/* ── PARTE 2: ATOS CONSTITUTIVOS ── */}
      <div style={{ borderTop: "3px double #1a365d", marginTop: 40, paddingTop: 30 }}>
        <p id="ae-atos" style={{ textAlign: "center", fontSize: "12pt", fontWeight: 700, marginBottom: 4 }}>ATOS CONSTITUTIVOS</p>

        <p style={{ textAlign: "center", fontSize: "13pt", fontWeight: 700, marginBottom: 4 }}>{ph(d.emp_razao_nova)}</p>
        <p style={{ textAlign: "center", fontSize: "11pt", marginBottom: 2 }}>CNPJ {ph(d.emp_cnpj)}</p>
        <p style={{ textAlign: "center", fontSize: "11pt", marginBottom: 2 }}>NIRE {ph(d.emp_nire)}</p>
        <p style={{ textAlign: "center", fontSize: "11pt", marginBottom: 20 }}>EM {ph(d.emp_data_registro)}</p>

        <p style={pStyle}>{ph(d.atos_preambulo)}</p>

        <h2 id="ae-denominacao-atos" style={secStyle}>CAPÍTULO I — DENOMINAÇÃO, SEDE, OBJETO E DURAÇÃO</h2>

        <p style={pStyle}><b>Cláusula 1.</b> {ph(d.atos_cl1)}</p>

        <p style={pStyle}><b>Cláusula 2.</b> {ph(d.atos_cl2)}</p>

        <p style={pStyle}><b>Cláusula 3.</b> {ph(d.atos_cl3)}</p>

        <p style={pStyle}><b>Cláusula 4.</b> {ph(d.atos_cl4)}</p>

        <h2 id="ae-capital" style={secStyle}>CAPÍTULO II — CAPITAL SOCIAL</h2>

        <p style={pStyle}><b>Cláusula 5.</b> {ph(d.atos_cl5)}</p>

        <p style={pStyle}><b>Cláusula 6.</b> {ph(d.atos_cl6)}</p>

        <h2 id="ae-admin" style={secStyle}>CAPÍTULO III — ADMINISTRAÇÃO E DECLARAÇÃO DO SÓCIO</h2>

        <p style={pStyle}><b>Cláusula 7.</b> {ph(d.atos_cl7)}</p>

        <p style={pStyle}><b>Cláusula 8.</b> {ph(d.atos_cl8)}</p>

        <p style={pStyle}><b>Cláusula 9.</b> {ph(d.atos_cl9)}</p>

        <p style={pStyle}><b>Cláusula 10.</b> {ph(d.atos_cl10)}</p>

        <h2 id="ae-deliberacoes" style={secStyle}>CAPÍTULO IV — DAS DELIBERAÇÕES SOCIAIS</h2>

        <p style={pStyle}><b>Cláusula 11.</b> {ph(d.atos_cl11)}</p>

        <p style={pStyle}><b>Cláusula 12.</b> {ph(d.atos_cl12)}</p>

        <p style={pStyle}><b>Cláusula 13.</b> {ph(d.atos_cl13)}</p>

        <h2 id="ae-exercicio" style={secStyle}>CAPÍTULO V — DO EXERCÍCIO SOCIAL, BALANÇO E LUCROS</h2>

        <p style={pStyle}><b>Cláusula 14.</b> {ph(d.atos_cl14)}</p>

        <h2 id="ae-continuidade" style={secStyle}>CAPÍTULO VI — DA CONTINUIDADE DA SOCIEDADE</h2>

        <p style={pStyle}><b>Cláusula 15.</b> {ph(d.atos_cl15)}</p>

        <h2 id="ae-foro" style={secStyle}>CAPÍTULO VII — FORO</h2>

        <p style={pStyle}><b>Cláusula 16.</b> {ph(d.atos_cl16)}</p>

        <p style={pStyle}>E assim, estando as Partes de comum acordo quanto ao contratado, dando-o por justo e acertado, assinam o presente Contrato digitalmente.</p>

        <p id="ae-assinatura" style={pStyle}>{ph(d.vig_local_data, "Belo Horizonte, __ de ________ de ____")}</p>

        <div style={{ marginTop: 40, textAlign: "center" }}>
          <div style={{ width: "60%", margin: "0 auto", borderTop: "1px solid #333", paddingTop: 8 }}>
            <b>{ph(d.emp_razao_nova)}</b><br />
            {ph(d.sc_nome)}<br />
            Sócia Administradora
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══ CONTRACT EDITOR (Form + Preview) ═══ */
function ContractEditor({ data, setData, fieldGroups, clauseItems, onExportDOCX, onExportPDF, PaperComponent }) {
  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Form Panel */}
      <div style={{
        width: "42%", minWidth: 340, background: C.surface, borderRight: `1px solid ${C.border}`,
        overflowY: "auto", padding: "28px 24px",
      }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <ActionBtn icon="📄" label="Exportar DOCX" onClick={onExportDOCX} accent={C.navy} />
          <ActionBtn icon="🖨️" label="Exportar PDF" onClick={onExportPDF} accent={C.gold} />
        </div>

        {fieldGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: 20 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8, marginBottom: 12,
              fontSize: 15, fontWeight: 700, color: C.text, fontFamily: "'DM Sans', sans-serif",
            }}>
              <span style={{ fontSize: 20 }}>{group.icon}</span> {group.title}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 14px" }}>
              {group.fields.map(f => (
                <div key={f.id} style={f.id.includes("endereco") || f.id.includes("razao") || f.type === "textarea" ? { gridColumn: "1/-1" } : {}}>
                  <Field field={f} value={data[f.id]} onChange={val => setData(prev => ({ ...prev, [f.id]: val }))} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Preview Panel */}
      <div style={{ flex: 1, background: "#dde3ed", overflowY: "auto", padding: "30px 20px" }}>
        <div style={{
          maxWidth: 800, margin: "0 auto", background: C.paper, borderRadius: 6,
          boxShadow: "0 2px 12px rgba(0,0,0,.08)", minHeight: "100%",
        }}>
          {PaperComponent ? <PaperComponent data={data} /> : <ContractPaper data={data} />}
        </div>
      </div>
    </div>
  );
}

/* ═══ SIDEBAR ITEM ═══ */
function SidebarItem({ icon, label, active, onClick, collapsed }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "9px 0" : "9px 14px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderRadius: 8, cursor: "pointer", fontSize: 13.5, fontWeight: active ? 700 : 500,
        background: active ? C.accentDim + "33" : hover ? C.sidebarHover : "transparent",
        color: active ? C.accentBright : "#cbd5e1",
        transition: "all .15s",
      }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      {!collapsed && <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
    </div>
  );
}

/* ═══ MOBILE HEADER ═══ */
function MobileHeader({ onToggleSidebar }) {
  return (
    <div style={{
      display: "none", position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: C.sidebar, padding: "12px 16px", alignItems: "center", gap: 12,
      borderBottom: `1px solid ${C.borderDark}`,
    }}
    className="mobile-header">
      <button onClick={onToggleSidebar} style={{
        background: "none", border: "none", color: C.goldLight, fontSize: 22, cursor: "pointer",
      }}>☰</button>
      <img src={import.meta.env.BASE_URL + "logo-essencial.jpeg"} alt="Logo" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.gold}` }} />
      <span style={{ color: C.goldLight, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 16 }}>
        Essencial Contabilidade
      </span>
    </div>
  );
}

/* ═══ MOBILE SIDEBAR OVERLAY ═══ */
function MobileSidebarOverlay({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200 }} className="mobile-overlay">
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)" }} />
      <div style={{
        position: "absolute", top: 0, left: 0, bottom: 0, width: 280,
        background: C.sidebar, overflowY: "auto", padding: "20px 14px",
        animation: "slideIn .2s ease",
      }}>
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════ */
export default function App() {
  const [dataPrestacao, setDataPrestacao] = useState({ ...DEFAULT_DATA_PRESTACAO });
  const [dataParceria, setDataParceria] = useState({ ...DEFAULT_DATA_PARCERIA });
  const [dataSocial, setDataSocial] = useState({ ...DEFAULT_DATA_SOCIAL });
  const [dataCabeleireiro, setDataCabeleireiro] = useState({ ...DEFAULT_DATA_CABELEIREIRO });
  const [dataInatividade, setDataInatividade] = useState({ ...DEFAULT_DATA_INATIVIDADE });
  const [dataAlteracao, setDataAlteracao] = useState({ ...DEFAULT_DATA_ALTERACAO });
  const [dataDistrato, setDataDistrato] = useState({ ...DEFAULT_DATA_DISTRATO });
  const [dataParalisacao, setDataParalisacao] = useState({ ...DEFAULT_DATA_PARALISACAO });
  const [dataAlteracaoEssencial, setDataAlteracaoEssencial] = useState({ ...DEFAULT_DATA_ALTERACAOESSENCIAL });
  const [view, setView] = useState("prestacao");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeClause, setActiveClause] = useState(null);

  const handleClauseClick = useCallback((id) => {
    setActiveClause(id);
    scrollToId(id);
    setTimeout(() => setActiveClause(null), 1500);
  }, []);

  const configs = {
    prestacao: { data: dataPrestacao, setData: setDataPrestacao, fieldGroups: FIELD_GROUPS_PRESTACAO, clauseItems: CLAUSE_ITEMS_PRESTACAO, exportDOCX: () => exportDOCX(dataPrestacao), exportPDF: () => exportPDF(dataPrestacao), Paper: ContractPaper },
    parceria: { data: dataParceria, setData: setDataParceria, fieldGroups: FIELD_GROUPS_PARCERIA, clauseItems: CLAUSE_ITEMS_PARCERIA, exportDOCX: () => exportDOCXParceria(dataParceria), exportPDF: () => exportPDFParceria(dataParceria), Paper: ContractPaperParceria },
    social: { data: dataSocial, setData: setDataSocial, fieldGroups: FIELD_GROUPS_SOCIAL, clauseItems: CLAUSE_ITEMS_SOCIAL, exportDOCX: () => exportDOCXSocial(dataSocial), exportPDF: () => exportPDFSocial(dataSocial), Paper: ContractPaperSocial },
    cabeleireiro: { data: dataCabeleireiro, setData: setDataCabeleireiro, fieldGroups: FIELD_GROUPS_CABELEIREIRO, clauseItems: CLAUSE_ITEMS_CABELEIREIRO, exportDOCX: () => exportDOCXCabeleireiro(dataCabeleireiro), exportPDF: () => exportPDFCabeleireiro(dataCabeleireiro), Paper: ContractPaperCabeleireiro },
    inatividade: { data: dataInatividade, setData: setDataInatividade, fieldGroups: FIELD_GROUPS_INATIVIDADE, clauseItems: CLAUSE_ITEMS_INATIVIDADE, exportDOCX: () => exportDOCXInatividade(dataInatividade), exportPDF: () => exportPDFInatividade(dataInatividade), Paper: ContractPaperInatividade },
    alteracao: { data: dataAlteracao, setData: setDataAlteracao, fieldGroups: FIELD_GROUPS_ALTERACAO, clauseItems: CLAUSE_ITEMS_ALTERACAO, exportDOCX: () => exportDOCXAlteracao(dataAlteracao), exportPDF: () => exportPDFAlteracao(dataAlteracao), Paper: ContractPaperAlteracao },
    distrato: { data: dataDistrato, setData: setDataDistrato, fieldGroups: FIELD_GROUPS_DISTRATO, clauseItems: CLAUSE_ITEMS_DISTRATO, exportDOCX: () => exportDOCXDistrato(dataDistrato), exportPDF: () => exportPDFDistrato(dataDistrato), Paper: ContractPaperDistrato },
    paralisacao: { data: dataParalisacao, setData: setDataParalisacao, fieldGroups: FIELD_GROUPS_PARALISACAO, clauseItems: CLAUSE_ITEMS_PARALISACAO, exportDOCX: () => exportDOCXParalisacao(dataParalisacao), exportPDF: () => exportPDFParalisacao(dataParalisacao), Paper: ContractPaperParalisacao },
    alteracaoessencial: { data: dataAlteracaoEssencial, setData: setDataAlteracaoEssencial, fieldGroups: FIELD_GROUPS_ALTERACAOESSENCIAL, clauseItems: CLAUSE_ITEMS_ALTERACAOESSENCIAL, exportDOCX: () => exportDOCXAlteracaoEssencial(dataAlteracaoEssencial), exportPDF: () => exportPDFAlteracaoEssencial(dataAlteracaoEssencial), Paper: ContractPaperAlteracaoEssencial },
  };
  const cfg = configs[view] || configs.prestacao;
  const currentData = cfg.data;
  const currentSetData = cfg.setData;
  const currentFieldGroups = cfg.fieldGroups;
  const currentClauseItems = cfg.clauseItems;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        html, body, #root { height: 100%; margin: 0; font-family: 'DM Sans', sans-serif; }
        ::-webkit-scrollbar { width: 7px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.muted}; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @media(max-width:1024px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .main-content { margin-left: 0 !important; padding-top: 56px !important; }
        }
        @media(max-width:640px) {
          .editor-split { flex-direction: column !important; }
          .editor-split > div:first-child { width: 100% !important; min-width: 0 !important; border-right: none !important; border-bottom: 1px solid ${C.border} !important; max-height: 50vh !important; }
          .editor-split > div:last-child { flex: 1 !important; }
        }
      `}</style>

      <MobileHeader onToggleSidebar={() => setMobileSidebarOpen(true)} />
      <MobileSidebarOverlay open={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)}>
        <SidebarContent
          sidebarOpen={true}
          view={view}
          setView={setView}
          clauseItems={currentClauseItems}
          activeClause={activeClause}
          handleClauseClick={(id) => { handleClauseClick(id); setMobileSidebarOpen(false); }}
        />
      </MobileSidebarOverlay>

      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        {/* Desktop Sidebar */}
        <div className="desktop-sidebar" style={{
          width: sidebarOpen ? 270 : 56, background: C.sidebar, display: "flex", flexDirection: "column",
          transition: "width .25s ease", flexShrink: 0, borderRight: `1px solid ${C.borderDark}`,
        }}>
          <SidebarContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            view={view}
            setView={setView}
            clauseItems={currentClauseItems}
            activeClause={activeClause}
            handleClauseClick={handleClauseClick}
          />
        </div>

        {/* Main Content */}
        <div className="main-content" style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", animation: "fadeIn .3s ease" }}>
          <div className="editor-split" style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            <ContractEditor
              data={currentData}
              setData={currentSetData}
              fieldGroups={currentFieldGroups}
              clauseItems={currentClauseItems}
              onExportDOCX={cfg.exportDOCX}
              onExportPDF={cfg.exportPDF}
              PaperComponent={cfg.Paper}
            />
          </div>
        </div>
      </div>
    </>
  );
}

/* ═══ SIDEBAR CONTENT ═══ */
function SidebarContent({ sidebarOpen, setSidebarOpen, view, setView, clauseItems, activeClause, handleClauseClick }) {
  return (
    <>
      {/* Logo / Header */}
      <div style={{
        padding: sidebarOpen ? "20px 16px 12px" : "20px 0 12px",
        borderBottom: `1px solid ${C.borderDark}`,
        textAlign: sidebarOpen ? "left" : "center",
      }}>
        {sidebarOpen ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src={import.meta.env.BASE_URL + "logo-essencial.jpeg"} alt="Logo" style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.gold}` }} />
              <div>
                <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 17, color: C.goldLight, letterSpacing: -0.3 }}>
                  Essencial
                </div>
                <div style={{ fontSize: 11, color: C.light, marginTop: 1 }}>Contabilidade — Contratos</div>
              </div>
            </div>
            {setSidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} style={{
                background: "none", border: "none", color: C.light, fontSize: 18, cursor: "pointer", padding: 4,
              }}>◀</button>
            )}
          </div>
        ) : (
          <button onClick={() => setSidebarOpen && setSidebarOpen(true)} style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}>
            <img src={import.meta.env.BASE_URL + "logo-essencial.jpeg"} alt="Logo" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.gold}` }} />
          </button>
        )}
      </div>

      {/* Contract Types */}
      <div style={{ padding: sidebarOpen ? "12px 10px 6px" : "12px 6px 6px" }}>
        {sidebarOpen && <div style={{ fontSize: 10, textTransform: "uppercase", color: C.light, fontWeight: 700, letterSpacing: 1, marginBottom: 8, padding: "0 4px" }}>Contratos</div>}
        {CONTRACT_TYPES.map(ct => (
          <SidebarItem key={ct.id} icon={ct.icon} label={ct.label} active={view === ct.id}
            onClick={() => setView(ct.id)} collapsed={!sidebarOpen} />
        ))}
      </div>

      {/* Clause Navigation */}
      <div style={{ padding: sidebarOpen ? "6px 10px" : "6px 6px", flex: 1, overflowY: "auto" }}>
        {sidebarOpen && <div style={{ fontSize: 10, textTransform: "uppercase", color: C.light, fontWeight: 700, letterSpacing: 1, marginBottom: 8, padding: "0 4px" }}>Cláusulas</div>}
        {clauseItems.map(ci => (
          <SidebarItem key={ci.id} icon={ci.icon} label={ci.label} active={activeClause === ci.id}
            onClick={() => handleClauseClick(ci.id)} collapsed={!sidebarOpen} />
        ))}
      </div>
    </>
  );
}
