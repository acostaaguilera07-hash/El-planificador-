
import { Subject, Grade, QuizQuestion } from "../types";

export const exportToWord = (
  title: string,
  content: string,
  grade: Grade,
  subject: Subject,
  author: string,
  mainImage: string | null,
  inlineImages: Record<string, string>
) => {
  const formattedContent = content
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      
      // Handle Bold globally for the line
      let processed = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      if (processed.startsWith('# ')) {
        return `<h1 style="color: #1e3a8a; font-family: Arial, sans-serif; font-size: 14pt; border-bottom: 2pt solid #1e3a8a; padding-bottom: 10pt; text-align: center; margin-top: 20pt;">${processed.replace('# ', '')}</h1>`;
      }
      if (processed.startsWith('## ')) {
        return `<h2 style="color: #1e40af; font-family: Arial, sans-serif; font-size: 12pt; margin-top: 25pt; border-left: 5pt solid #1e40af; padding-left: 10pt; margin-bottom: 10pt;">${processed.replace('## ', '')}</h2>`;
      }
      if (processed.startsWith('- ')) {
        return `<li style="font-family: Arial, sans-serif; font-size: 12pt; margin-bottom: 8pt; list-style-type: disc; color: #334155; margin-left: 20pt;">${processed.replace('- ', '')}</li>`;
      }
      if (processed.startsWith('>')) {
        return `<div style="background-color: #fefce8; border: 1pt solid #eab308; border-left: 8pt solid #eab308; padding: 15pt; margin: 20pt 0; font-style: italic; color: #854d0e; font-family: Arial, sans-serif; font-size: 12pt;">${processed.replace('>', '').trim()}</div>`;
      }
      
      if (processed.includes('<<IMAGE:')) {
        const match = processed.match(/<<IMAGE:(.*?)>>/);
        if (match) {
          const prompt = match[1].trim();
          const imgSrc = inlineImages[prompt];
          if (imgSrc) {
            return `<div style="text-align: center; margin: 30pt 0;"><img src="${imgSrc}" style="width: 100%; max-width: 6in; height: auto; border: 1pt solid #ddd;" /><p style="color: #64748b; font-size: 10pt; margin-top: 5pt; font-family: Arial, sans-serif;">${prompt}</p></div>`;
          }
          return '';
        }
      }
      
      if (processed === '') return '<br/>';
      return `<p style="font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.8; text-align: justify; color: #1e293b; margin-bottom: 15pt;">${processed}</p>`;
    })
    .join('');

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12pt; padding: 40pt; } 
      .header { text-align: center; border-bottom: 3pt double #1e3a8a; margin-bottom: 30pt; padding-bottom: 10pt; }
      p, li, div { font-family: Arial, sans-serif; font-size: 12pt; }
    </style>
    </head>
    <body>
      <div class="header">
        <h2 style="color: #1e3a8a; margin: 0; font-family: Arial, sans-serif; font-size: 14pt;">NATSEVILLA 3.0 - PLANEACIÓN</h2>
        <p style="color: #475569; font-family: Arial, sans-serif; font-size: 12pt;"><strong>Materia:</strong> ${subject} | <strong>Grado:</strong> ${grade} | <strong>Docente:</strong> ${author}</p>
      </div>
      ${mainImage ? `<div style="text-align:center; margin-bottom: 30pt;"><img src="${mainImage}" style="width: 100%; max-width: 6in; height: auto;"/></div>` : ''}
      ${formattedContent}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Planeacion_${title.replace(/\s+/g, '_')}.doc`;
  link.click();
};

export const exportQuizToWord = (
  questions: QuizQuestion[],
  grade: Grade,
  subject: Subject,
  topic: string,
  author: string,
  quizImages: Record<string, string>
) => {
  const questionsHtml = questions.map((q, idx) => {
    const imageHtml = q.imagePrompt && quizImages[q.imagePrompt] 
      ? `<div style="text-align: center; margin: 20pt 0;"><img src="${quizImages[q.imagePrompt]}" style="width: 100%; max-width: 5in; height: auto; border: 1pt solid #ccc; border-radius: 10pt;" /></div>` 
      : '';

    const optionsHtml = q.options.map((opt, oIdx) => `
      <p style="margin-left: 20pt; font-family: Arial, sans-serif; font-size: 12pt;"><strong>${String.fromCharCode(65 + oIdx)})</strong> ${opt}</p>
    `).join('');

    return `
      <div style="margin-bottom: 30pt; page-break-inside: avoid;">
        <p style="background-color: #f1f5f9; padding: 10pt; font-weight: bold; color: #1e40af; font-family: Arial, sans-serif; font-size: 12pt; border-radius: 5pt;">Pregunta ${idx + 1} - ${q.competency || 'Competencia General'}</p>
        ${q.context ? `<p style="font-style: italic; color: #475569; border-left: 4pt solid #cbd5e1; padding-left: 15pt; margin: 15pt 0; font-family: Arial, sans-serif; font-size: 12pt;">"${q.context}"</p>` : ''}
        ${imageHtml}
        <p style="font-size: 12pt; font-weight: bold; margin: 15pt 0; font-family: Arial, sans-serif; color: #1e293b;">${q.question}</p>
        <div style="margin-top: 10pt;">${optionsHtml}</div>
      </div>
    `;
  }).join('');

  const html = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head><meta charset='utf-8'>
    <style>
      body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.6; padding: 20pt; }
      .exam-header { border: 3pt solid #1e3a8a; padding: 20pt; margin-bottom: 40pt; border-radius: 10pt; background-color: #f8fafc; }
      .student-data { margin-bottom: 25pt; border-bottom: 2pt solid #e2e8f0; padding-bottom: 10pt; font-family: Arial, sans-serif; font-size: 12pt; }
      p, li, div, td, th { font-family: Arial, sans-serif; font-size: 12pt; }
    </style>
    </head>
    <body>
      <div class="exam-header" style="text-align: center;">
        <h1 style="margin:0; color: #1e3a8a; font-size: 16pt; font-family: Arial, sans-serif;">NATSEVILLA 3.0</h1>
        <h2 style="margin:5pt 0; color: #1e40af; font-size: 14pt; font-family: Arial, sans-serif;">EVALUACIÓN DE COMPETENCIAS</h2>
        <p style="margin:10pt 0; color: #475569; font-family: Arial, sans-serif; font-size: 12pt;"><strong>Tema:</strong> ${topic} | <strong>Materia:</strong> ${subject} | <strong>Grado:</strong> ${grade}</p>
        <p style="margin:5px 0; font-size: 10pt; color: #64748b; font-family: Arial, sans-serif;">Diseño: ${author}</p>
      </div>

      <div style="margin-bottom: 40pt;">
        <p class="student-data"><strong>Nombre del Estudiante:</strong> ____________________________________________________</p>
        <p class="student-data"><strong>Fecha:</strong> _______________________ &nbsp;&nbsp;&nbsp; <strong>Calificación:</strong> ___________</p>
      </div>

      ${questionsHtml}

      <div style="margin-top: 50pt; page-break-before: always; border-top: 3pt solid #1e3a8a; padding-top: 30pt;">
        <h3 style="text-align: center; color: #1e3a8a; font-family: Arial, sans-serif; font-size: 14pt;">HOJA DE RESPUESTAS (PARA EL DOCENTE)</h3>
        <table border="1" style="width: 100%; border-collapse: collapse; text-align: center; font-family: Arial, sans-serif; font-size: 12pt;">
          <tr style="background-color: #f1f5f9; color: #1e3a8a;">
            <th style="padding: 10pt;">Pregunta</th>
            <th style="padding: 10pt;">Respuesta Correcta</th>
            <th style="padding: 10pt;">Competencia Evaluada</th>
          </tr>
          ${questions.map((q, i) => `
            <tr>
              <td style="padding: 8pt;">${i + 1}</td>
              <td style="padding: 8pt;"><strong>${String.fromCharCode(65 + q.correctAnswerIndex)}</strong></td>
              <td style="padding: 8pt;">${q.competency || 'N/A'}</td>
            </tr>
          `).join('')}
        </table>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', html], { type: 'application/msword' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `Evaluacion_${topic.replace(/\s+/g, '_')}.doc`;
  link.click();
};
