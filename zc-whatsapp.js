/* Pacote Z.3 — WhatsApp, OS helpers, aceite, modal WA */
// ═══ WHATSAPP ═══
// [v4.8.2 ALTERAÇÃO]
// Mensagem de boas-vindas passou a ser dinâmica: usa dados reais do cadastro do atendimento
// (serviço, valor, condições identificadas e aviso de sujidade crítica quando aplicável).
function precoServico_(nomeServico){
  for(var i=0;i<SERVICES.length;i++){
    if(SERVICES[i].name===nomeServico)return parseFloat(SERVICES[i].price)||0;
  }
  var leg=LEGACY_SERVICE_ALIASES[nomeServico];
  if(leg)return parseFloat(leg.price)||0;
  return 0;
}
function normalizarObsLista_(obs){
  if(!obs)return[];
  if(Array.isArray(obs))return obs.filter(function(x){return String(x||'').trim();});
  return String(obs).split(',').map(function(x){return x.trim();}).filter(Boolean);
}
function buscarClienteParaWhats_(nome,tel){
  var telNorm=String(tel||'').replace(/\D/g,'');
  for(var i=0;i<clientes.length;i++){
    var c=clientes[i]||{};
    if(String(c.tel||'').replace(/\D/g,'')===telNorm)return c;
  }
  var nomeNorm=String(nome||'').toLowerCase().trim();
  for(var j=0;j<clientes.length;j++){
    var c2=clientes[j]||{};
    if(String(c2.nome||'').toLowerCase().trim()===nomeNorm)return c2;
  }
  return null;
}
function montarDetalhesAtendimento_(nome,tel,qtd,servicos,observacoes,total,desconto,os,numVisita,totalVisitas){
  return{
    os:os||null,
    nome:nome,
    tel:tel,
    qtd:parseInt(qtd||0),
    servicos:Array.isArray(servicos)?servicos.slice(0,qtd):[],
    observacoes:Array.isArray(observacoes)?observacoes.slice(0,qtd):[],
    total:parseFloat(total||0)||0,
    desconto:parseFloat(desconto||0)||0,
    numVisita:parseInt(numVisita||1,10)||1,
    totalVisitas:parseInt(totalVisitas||numVisita||1,10)||1,
    diasDesdeUltima:null,
    vipCompleto:null,
    aceiteUrl:os?aceiteOsUrl_(os):''
  };
}
function detalhesDoCliente_(nome,tel,qtd){
  var c=buscarClienteParaWhats_(nome,tel);
  if(!c)return null;
  return montarDetalhesAtendimento_(c.nome||nome,c.tel||tel,c.qtd||qtd,c.servicos||[],c.observacoes||[],c.total||0,c.desconto||0,c.num||null,c.numVisita||1,c.totalVisitas||1);
}

// [v4.8.5 NOVO]
// Gera resumo operacional interno da OS para copiar e localizar rapidamente atendimentos sem alterar backend/planilha.
function montarResumoOSCliente_(c){
  if(!c)return '';
  var linhas=[];
  linhas.push('OS '+formatarOS_(c.num));
  linhas.push('Cliente: '+(c.nome||'Não informado'));
  linhas.push('Telefone: '+formatarTelefoneBR_(c.tel||''));
  linhas.push('Status: '+(c.status||'Em andamento'));
  linhas.push('Data/Hora: '+fmtData(c.data)+' '+fmtHora(c.hora));
  linhas.push('Capacetes: '+(c.qtd||1));
  if(c.total)linhas.push('Total: '+fmtBRL(c.total));
  var svcs=Array.isArray(c.servicos)?c.servicos:[];
  var obs=Array.isArray(c.observacoes)?c.observacoes:[];
  for(var i=0;i<svcs.length;i++){
    if(!svcs[i])continue;
    linhas.push('');
    linhas.push('CAPACETE '+(i+1));
    linhas.push('Serviço: '+svcs[i]);
    var o=normalizarObsLista_(obs[i]);
    if(o.length)linhas.push('Condições: '+o.join(', '));
  }
  if(c.pasta){linhas.push('');linhas.push('Drive: '+c.pasta);}
  return linhas.join('\n');
}
function copiarResumoOS(num){
  var c=clientes.find(function(x){return String(x.num)===String(num);});
  var txt=montarResumoOSCliente_(c);
  if(!txt){showToast('OS não encontrada','error');return;}
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(txt).then(function(){showToast('Resumo da OS copiado','blue');}).catch(function(){prompt('Copie o resumo da OS:',txt);});
  }else{
    prompt('Copie o resumo da OS:',txt);
  }
}
function gerarOsPdf(num){
  var c=clientes.find(function(x){return String(x.num)===String(num);});
  showToast('Gerando PDF da OS '+formatarOS_(num)+'...','blue');
  logEventoSistema_('PDF','gerarOsPdf','INFO','Solicitada OS digital',{os:num,nome:c?c.nome:''});
  apiGet('gerarOsPdf',{num:num},30000).then(function(r){
    if(r&&r.ok&&r.url){
      showToast('OS digital gerada','green');
      logEventoSistema_('PDF','gerarOsPdf','OK','OS digital aberta',{os:num,url:r.url});
      window.open(r.url,'_blank');
    }else{
      showToast('Nao foi possivel gerar a OS','error');
      logEventoSistema_('PDF','gerarOsPdf','ERRO',String(r&&r.error||'Resposta invalida'),{os:num});
    }
  }).catch(function(err){
    showToast('Falha ao gerar PDF da OS','error');
    logEventoSistema_('PDF','gerarOsPdf','ERRO',String(err||'Falha API'),{os:num});
  });
}
function copiarLinkAceiteOs(num){
  var c=clientes.find(function(x){return String(x.num)===String(num);});
  var url=(c&&c.aceite&&c.aceite.url)||aceiteOsUrl_(num);
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(url).then(function(){showToast('Link de aceite copiado','blue');}).catch(function(){prompt('Copie o link de aceite:',url);});
  }else{
    prompt('Copie o link de aceite:',url);
  }
}
function msgAceiteOs_(c){
  var url=(c&&c.aceite&&c.aceite.url)||aceiteOsUrl_(c&&c.num);
  var svcs=Array.isArray(c&&c.servicos)?c.servicos.filter(Boolean).join(', '):'serviço registrado';
  return 'Olá, '+(c.nome||'tudo bem')+'! Para manter sua OS '+formatarOS_(c.num)+' registrada com segurança, confirme o aceite digital pelo botão neste link:\n\n'+
    url+'\n\nServiço(s): '+svcs+'\nValor: '+fmtBRL(c.total||0)+'\n\nÉ rápido e ajuda a ZapClin manter tudo organizado para você. ✅';
}
function enviarAceiteWhatsApp_(num){
  var c=clientes.find(function(x){return String(x.num)===String(num);});
  if(!c)return;
  waData={tipo:'aceite-os',nome:c.nome,tel:c.tel,qtd:c.qtd||1,msg:msgAceiteOs_(c)};
  document.getElementById('waEmoji').textContent='✅';
  document.getElementById('waTitulo').textContent='Solicitar aceite da OS';
  document.getElementById('waClienteNome').textContent=c.nome||'Cliente';
  document.getElementById('waPreview').textContent=waData.msg;
  document.getElementById('waModal').classList.add('show');
}
// [v4.8.3 ALTERAÇÃO]
// Montagem da mensagem de WhatsApp sem emojis complexos para evitar caracteres quebrados no iOS/WhatsApp.
// Inclui vínculo do atendimento: OS, nome do cliente, telefone formatado e data/hora do recebimento.
function formatarOS_(os){
  var n=parseInt(os||0);
  if(!n)return 'Não informado';
  return '#'+String(n).padStart(6,'0');
}
function formatarTelefoneBR_(tel){
  var d=String(tel||'').replace(/\D/g,'');
  if(d.startsWith('55')&&d.length>11)d=d.substring(2);
  if(d.length===11)return '('+d.substring(0,2)+') '+d.substring(2,7)+'-'+d.substring(7);
  if(d.length===10)return '('+d.substring(0,2)+') '+d.substring(2,6)+'-'+d.substring(6);
  return String(tel||'').trim()||'Não informado';
}
function dataHoraRecebimento_(){
  var d=new Date();
  return String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0')+'/'+d.getFullYear()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
}
function clienteVipUrl_(nome,tel){
  return webAppUrl+'?action=cadastroVip&nome='+encodeURIComponent(nome||'')+'&tel='+encodeURIComponent(tel||'');
}
function aceiteOsUrl_(os){
  return webAppUrl+'?action=aceiteOs&os='+encodeURIComponent(os||'');
}
function isPrimeiraVisita_(detalhes){
  if(!detalhes)return true;
  var n=parseInt(detalhes.numVisita||detalhes.totalVisitas||1,10);
  return !n||n<=1;
}
function msgBoasVindas(nome,qtd,detalhes){
  detalhes=detalhes||detalhesDoCliente_(nome,'',qtd)||null;
  var linhas=[];
  var nomeCliente=(detalhes&&detalhes.nome)||nome||'Cliente';
  var telCliente=(detalhes&&detalhes.tel)||'';
  var primeira=isPrimeiraVisita_(detalhes);
  var precisaVip=primeira||(detalhes&&detalhes.vipCompleto===false);
  if(primeira){
    linhas.push('Seja muito bem-vindo(a) à *ZapClin*!');
  }else{
    linhas.push('Olá, '+nomeCliente+'! Que bom ter você de volta à *ZapClin*.');
    if(detalhes&&detalhes.diasDesdeUltima!==null&&detalhes.diasDesdeUltima!==undefined){
      linhas.push('Já faz '+detalhes.diasDesdeUltima+' dia(s) desde sua última visita. Gostamos de ver você cuidando bem do seu capacete.');
    }
  }
  linhas.push('');
  // [v4.8.4 NOVO]
  // Vincula a mensagem ao número real do atendimento retornado pelo backend (clienteId).
  linhas.push('*Atendimento:* OS '+formatarOS_(detalhes&&detalhes.os));
  linhas.push('*Cliente:* '+nomeCliente);
  linhas.push('*Telefone:* '+formatarTelefoneBR_(telCliente));
  linhas.push('*Data do recebimento:* '+dataHoraRecebimento_());
  linhas.push('');
  if(!detalhes||!detalhes.servicos||!detalhes.servicos.length){
    var caps=qtd===1?'capacete':'capacetes';
    linhas.push('Recebemos seu(s) '+qtd+' '+caps+' e cuidaremos de tudo com atenção e profissionalismo.');
    linhas.push('');
    linhas.push('Assim que estiver(em) pronto(s), avisamos por aqui.');
    if(detalhes&&detalhes.os){
      linhas.push('');
      linhas.push('*Botão de aceite digital da OS*');
      linhas.push('Abra o link abaixo e toque no botão verde *Aceito as condições da OS*:');
      linhas.push(detalhes.aceiteUrl||aceiteOsUrl_(detalhes.os));
    }
    if(precisaVip){
      linhas.push('');
      linhas.push('*Clube VIP ZapClin*');
      linhas.push('Complete seu cadastro e entre para nossa lista de privilégios. No mês do seu aniversário, você ganha benefício especial em *1 serviço da casa*, sempre aplicado com controle da ZapClin.');
      linhas.push('É rápido e vale a pena: '+clienteVipUrl_(nomeCliente,telCliente));
    }
    linhas.push('');
    linhas.push('Obrigado por escolher a *ZapClin*.');
    return linhas.join('\n');
  }
  linhas.push(primeira?'Recebemos seu atendimento e registramos abaixo as informações identificadas no cadastro:':'Recebemos seu capacete novamente e registramos abaixo as informações desta nova OS:');
  var temCondicoes=false;
  var temSujidadeCritica=false;
  var soma=0;
  for(var i=0;i<detalhes.servicos.length;i++){
    var svc=detalhes.servicos[i];
    if(!svc)continue;
    var preco=precoServico_(svc);
    soma+=preco;
    var obs=normalizarObsLista_(detalhes.observacoes[i]);
    if(obs.length)temCondicoes=true;
    if(obs.indexOf('Sujidade crítica')>=0)temSujidadeCritica=true;
    linhas.push('');
    linhas.push('------------------------------');
    linhas.push('*CAPACETE '+(i+1)+'*');
    linhas.push('');
    linhas.push('*Serviço escolhido:*');
    linhas.push(svc);
    linhas.push('');
    linhas.push('*Valor:*');
    linhas.push(fmtBRL(preco));
    if(obs.length){
      linhas.push('');
      linhas.push('*Condições identificadas no recebimento:*');
      obs.forEach(function(o){linhas.push('- '+o);});
    }
  }
  var desconto=parseFloat(detalhes.desconto||0)||0;
  var total=parseFloat(detalhes.total||0)||soma;
  if(detalhes.servicos.length>1||desconto>0){
    linhas.push('');
    linhas.push('------------------------------');
    if(desconto>0)linhas.push('*Desconto:* -'+fmtBRL(desconto));
    linhas.push('*Total do atendimento:* '+fmtBRL(total));
  }
  if(temSujidadeCritica){
    linhas.push('');
    linhas.push('*SUJIDADE CRÍTICA*');
    linhas.push('Foi informado que o serviço escolhido pode não remover completamente toda a sujidade existente no capacete. Mesmo assim, o cliente autorizou a execução conforme sua preferência.');
  }
  if(temCondicoes||temSujidadeCritica){
    linhas.push('');
    linhas.push('Ao responder *OK*, o cliente confirma ciência das condições registradas neste atendimento e autoriza a execução do serviço.');
  }
  if(detalhes&&detalhes.os){
    linhas.push('');
    linhas.push('*Botão de aceite digital da OS*');
    linhas.push('Abra o link abaixo e toque no botão verde *Aceito as condições da OS*:');
    linhas.push(detalhes.aceiteUrl||aceiteOsUrl_(detalhes.os));
  }
  if(precisaVip){
    linhas.push('');
    linhas.push('*Clube VIP ZapClin*');
    linhas.push(primeira?'Como esta é sua primeira visita, queremos te dar acesso aos nossos privilégios: complete seu cadastro e receba benefícios especiais no mês do seu aniversário.':'Seu cadastro VIP ainda não está completo. Finalizando agora, você libera benefícios especiais e a ZapClin consegue cuidar do seu histórico com mais precisão.');
    linhas.push('Leva menos de 1 minuto: '+clienteVipUrl_(nomeCliente,telCliente));
  }
  linhas.push('');
  linhas.push('Obrigado por escolher a *ZapClin*.');
  return linhas.join('\n');
}
function sugestaoRetiradaTexto_(){
  var h=new Date().getHours();
  if(h<11)return'Sugestão de retirada: hoje entre 12h e 14h, se ficar confortável para você.';
  if(h<15)return'Sugestão de retirada: hoje entre 16h e 18h, evitando o horário de maior movimento.';
  if(h<19)return'Sugestão de retirada: ainda hoje ou no próximo horário de atendimento.';
  return'Sugestão de retirada: no próximo horário de atendimento, com calma e segurança.';
}
function msgPronto(nome,qtd){var caps=qtd===1?'capacete ficou pronto':'capacetes ficaram prontos';return'Olá, '+nome+'! 🎉\n\nSeu(s) '+qtd+' '+caps+' e está(ão) impecável(is)! 🪖✨\n\nPode vir buscar quando quiser — estamos te esperando! 😊\n'+sugestaoRetiradaTexto_()+'\n\nDepois da retirada, sua avaliação ajuda muito a ZapClin crescer. Se puder, avalie nosso atendimento no Google:\n'+GOOGLE_REVIEW_URL+'\n\nAté logo,\n*ZapClin Higienização* 💙\n📸 *@zapclinhigienizacao*';}
function msgAgradecimento(nome){return'Olá, '+nome+'! 🙌\n\nObrigado pela confiança na *ZapClin*! 🪖✨\n\nFoi um prazer cuidar do seu(s) capacete(s). Já sentimos saudade! 😄\n\nTe esperamos em breve! 🏍️💨\n\n*ZapClin Higienização* 💙\n📸 *@zapclinhigienizacao*';}
function mostrarWaModal(tipo,nome,tel,qtd,detalhes){
  if(tipo==='boasVindas'&&!detalhes)detalhes=detalhesDoCliente_(nome,tel,qtd);
  var msg=tipo==='pronto'?msgPronto(nome,qtd):tipo==='agradecimento'?msgAgradecimento(nome):msgBoasVindas(nome,qtd,detalhes);
  waData={tipo:tipo,nome:nome,tel:tel,qtd:qtd,msg:msg};
  document.getElementById('waEmoji').textContent=tipo==='pronto'?'🎉':tipo==='agradecimento'?'🙌':'📲';
  document.getElementById('waTitulo').textContent=tipo==='pronto'?'Capacete(s) Pronto(s)!':tipo==='agradecimento'?'Agradecimento':'Enviar Recebimento';
  document.getElementById('waClienteNome').textContent=nome;
  document.getElementById('waPreview').textContent=msg;
  document.getElementById('waModal').classList.add('show');
}
function fecharWaModal(){document.getElementById('waModal').classList.remove('show');}
function confirmarEnvioWA(){var tel=waData.tel.replace(/\D/g,'');if(tel.startsWith('0'))tel=tel.substring(1);if(!tel.startsWith('55'))tel='55'+tel;logEventoSistema_('WHATSAPP','confirmarEnvioWA','OK','Mensagem WhatsApp gerada',{tipo:waData.tipo||'',nome:waData.nome||'',telefone:tel,qtd:waData.qtd||'',temOS:(waData.msg||'').indexOf('OS #')>=0});window.open('https://wa.me/'+tel+'?text='+encodeURIComponent(waData.msg),'_blank');fecharWaModal();}
