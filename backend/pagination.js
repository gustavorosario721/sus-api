export function describedMaximum(parameter) {
  const explicit = parameter.maximum ?? parameter.schema?.maximum;
  if (explicit !== undefined && explicit !== null) return Number(explicit);
  const description = String(parameter.description || '');
  const patterns = [
    /menor\s+ou\s+igual(?:\s+a)?\s*(\d+)/i,
    /(?:máximo|maxima|máxima|limite máximo)\s*(?:de|é|igual a)?\s*(\d+)/i,
    /até\s+(\d+)\s+(?:registros|itens|resultados)/i
  ];
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match) return Number(match[1]);
  }
  return null;
}

export function buildPageMetadata(sourcePageCount, params, paging, totalRecordsReported) {
  if (!paging) return null;
  const limit = Number(params.get(paging.limitParameter || 'limit') || paging.defaultLimit || 100);
  const pageParameter = paging.pageParameter || null;
  const offsetParameter = paging.offsetParameter || null;
  const usesPageNumber = Boolean(pageParameter && params.has(pageParameter));
  const page = usesPageNumber
    ? Math.max(1, Number(params.get(pageParameter) || 1))
    : offsetParameter
      ? Math.floor(Number(params.get(offsetParameter) || 0) / limit) + 1
      : 1;
  const offset = usesPageNumber
    ? (page - 1) * limit
    : offsetParameter ? Number(params.get(offsetParameter) || 0) : 0;
  const canNavigate = Boolean(pageParameter || offsetParameter);
  const hasNext = canNavigate && (totalRecordsReported !== null && totalRecordsReported !== undefined
    ? offset + limit < totalRecordsReported
    : sourcePageCount >= limit);
  return {
    limit, offset, page, totalRecordsReported: totalRecordsReported ?? null,
    canNavigate, pageParameter,
    hasPrevious: canNavigate && page > 1, hasNext,
    previousOffset: !canNavigate ? null : pageParameter ? Math.max(1, page - 1) : Math.max(0, offset - limit),
    nextOffset: !canNavigate ? null : pageParameter ? page + 1 : offset + limit,
    offsetParameter,
    offsetSemantics: pageParameter
      ? 'Número de página iniciado em 1, conforme a documentação da fonte.'
      : 'Deslocamento em linhas iniciado em zero, conforme a documentação da fonte.'
  };
}
