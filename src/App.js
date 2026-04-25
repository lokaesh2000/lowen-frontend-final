import React, { useEffect, useMemo, useRef, useState } from 'react';
import './App.css';
import { DEMO_ASSUMPTIONS, DEMO_IMAGE_GROUPS } from './demoImageCatalog';

const evidenceCards = [
  {
    key: 'micro_pattern',
    title: 'Scale verification',
    description: 'The tape reference used to convert image pixels into quote-ready dimensions.',
  },
  {
    key: 'flattened_strips',
    title: 'Corrected trailer plane',
    description: 'The flattened trailer side used for perspective-correct measurement.',
  },
  {
    key: 'pixel_scan',
    title: 'Billable ink isolate',
    description: 'The printable region isolated for ink-yield and production review.',
  },
  {
    key: 'final_manifest',
    title: 'Production manifest',
    description: 'The final dimensional and reporting view returned by the pipeline.',
  },
];

const headerSignals = [
  'Macro + micro inputs',
  'Perspective-correct measurement',
  'Ink proof with visual checkpoints',
];

const formatMetric = (value, suffix = '') => {
  if (value === undefined || value === null || value === '') {
    return 'Unavailable';
  }

  return `${value}${suffix}`;
};

const getGraphicType = (fleetOwner) => {
  if (!fleetOwner) {
    return 'Unavailable';
  }

  const normalizedOwner = String(fleetOwner).trim().toLowerCase();

  if (['fedex', 'walmart', 'walamrt', 'costco'].includes(normalizedOwner)) {
    return 'Set of items';
  }

  if (['amazon', 'cococola', 'coca cola', 'coca-cola', 'cocacola'].includes(normalizedOwner)) {
    return 'Single item';
  }

  return 'Unavailable';
};

const assetPathToFile = async (assetPath, fileName) => {
  const response = await fetch(assetPath);

  if (!response.ok) {
    throw new Error(`Unable to load demo image: ${fileName}`);
  }

  const blob = await response.blob();
  return new File([blob], fileName, {
    type: blob.type || 'image/svg+xml',
  });
};

const MetricCard = ({ label, value, note, accent }) => (
  <article className={`metric-card metric-card--${accent}`}>
    <p className="eyebrow">{label}</p>
    <h3>{value}</h3>
    <p>{note}</p>
  </article>
);

const PreferredImageButton = ({ item, selected, disabled, onSelect, onView, tabIndex }) => (
  <article className={`preferred-image ${selected ? 'is-selected' : ''}`.trim()}>
    <img src={item.assetPath} alt={item.title} />
    <div className="preferred-image__footer">
      <span>{item.title}</span>
      <div className="preferred-image__actions">
        <button
          type="button"
          className="preferred-image__action preferred-image__action--ghost"
          onClick={() => onView(item)}
          tabIndex={tabIndex}
        >
          View
        </button>
        <button
          type="button"
          className="preferred-image__action preferred-image__action--primary"
          onClick={() => onSelect(item)}
          disabled={disabled}
          tabIndex={tabIndex}
        >
          Use image
        </button>
      </div>
    </div>
  </article>
);

const PreferredImagePanel = ({
  title,
  badge,
  hint,
  items,
  selectedId,
  disabled,
  emptyMessage,
  onSelect,
  onView,
}) => {
  const marqueeItems = items.length > 1 ? [...items, ...items] : items;

  return (
    <div className={`preferred-panel ${disabled ? 'is-disabled' : ''}`.trim()}>
      <div className="preferred-panel__head">
        <div className="preferred-panel__heading">
          <p>{title}</p>
          {badge ? <span className="preferred-panel__badge">{badge}</span> : null}
        </div>
        {hint ? <span className="preferred-panel__hint">{hint}</span> : null}
      </div>

      {items.length ? (
        <div className="preferred-panel__marquee">
          <div className={`preferred-panel__track ${items.length > 1 ? 'is-animated' : ''}`.trim()}>
            {marqueeItems.map((item, index) => (
              <PreferredImageButton
                key={`${item.id}-${index}`}
                item={item}
                selected={item.id === selectedId}
                disabled={disabled}
                onSelect={onSelect}
                onView={onView}
                tabIndex={index >= items.length ? -1 : 0}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="preferred-panel__empty">{emptyMessage}</div>
      )}
    </div>
  );
};

const UploadDropArea = ({
  panelTitle,
  panelSubtitle,
  description,
  disabledMessage,
  inputId,
  disabled,
  lockedMode,
  file,
  preview,
  onFileChange,
  onDrop,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onReset,
  isDragging,
}) => (
  <div className={`upload-card ${disabled ? 'is-disabled' : ''}`.trim()}>
    <div className="upload-card__header">
      <div>
        <h3>{panelTitle}</h3>
        <p>{panelSubtitle}</p>
      </div>
      {file ? (
        <button type="button" className="ghost-button" onClick={onReset}>
          Clear
        </button>
      ) : null}
    </div>

    <label
      className={`upload-dropzone ${preview ? 'has-preview' : ''} ${isDragging ? 'is-dragging' : ''} ${disabled ? 'is-disabled' : ''}`.trim()}
      htmlFor={disabled ? undefined : inputId}
      onDrop={disabled ? undefined : onDrop}
      onDragEnter={disabled ? undefined : onDragEnter}
      onDragLeave={disabled ? undefined : onDragLeave}
      onDragOver={disabled ? undefined : onDragOver}
    >
      <input
        id={inputId}
        type="file"
        accept="image/*"
        onChange={disabled ? undefined : onFileChange}
        disabled={disabled}
      />

      {preview ? <img src={preview} alt={`${panelTitle} preview`} className="upload-dropzone__image" /> : null}

      <div className="upload-dropzone__overlay">
        {preview ? (
          <div className="upload-dropzone__meta">
            <span>{lockedMode === 'preferred' ? 'Preferred image selected' : 'Uploaded image selected'}</span>
            <strong>{file?.name || panelTitle}</strong>
          </div>
        ) : disabled ? (
          <div className="upload-dropzone__empty">
            <strong>{disabledMessage || 'Choose the macro image first to unlock this field.'}</strong>
            <span>{description}</span>
          </div>
        ) : (
          <div className="upload-dropzone__empty">
            <strong>Drag or upload images</strong>
            <span>{description}</span>
          </div>
        )}
      </div>
    </label>
  </div>
);

const EvidenceCard = ({ title, description, src, onOpen }) => (
  <article className="visual-card">
    <div className="visual-card__header">
      <p className="eyebrow">Visual checkpoint</p>
      <h3>{title}</h3>
      <span>{description}</span>
    </div>
    <button type="button" className="visual-card__frame" onClick={() => src && onOpen({ title, src })}>
      {src ? <img src={src} alt={title} /> : <div className="visual-card__empty">No image returned.</div>}
    </button>
  </article>
);

const App = () => {
  const [macroFile, setMacroFile] = useState(null);
  const [microFile, setMicroFile] = useState(null);
  const [macroPreview, setMacroPreview] = useState('');
  const [microPreview, setMicroPreview] = useState('');
  const [macroMode, setMacroMode] = useState(null);
  const [microMode, setMicroMode] = useState(null);
  const [macroDemoId, setMacroDemoId] = useState('');
  const [microDemoId, setMicroDemoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [dragTarget, setDragTarget] = useState('');
  const [activeVisual, setActiveVisual] = useState(null);

  const macroObjectUrlRef = useRef('');
  const microObjectUrlRef = useRef('');
  const resultsRef = useRef(null);

  const selectedMacroGroup = useMemo(
    () => DEMO_IMAGE_GROUPS.find((group) => group.macro.id === macroDemoId) || null,
    [macroDemoId]
  );

  const availableMicroDemos = selectedMacroGroup?.microOptions || [];

  useEffect(() => {
    return () => {
      if (macroObjectUrlRef.current) {
        URL.revokeObjectURL(macroObjectUrlRef.current);
      }

      if (microObjectUrlRef.current) {
        URL.revokeObjectURL(microObjectUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (data && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [data]);

  const clearPreviewUrl = (kind) => {
    if (kind === 'macro' && macroObjectUrlRef.current) {
      URL.revokeObjectURL(macroObjectUrlRef.current);
      macroObjectUrlRef.current = '';
    }

    if (kind === 'micro' && microObjectUrlRef.current) {
      URL.revokeObjectURL(microObjectUrlRef.current);
      microObjectUrlRef.current = '';
    }
  };

  const resetMicroSelection = () => {
    clearPreviewUrl('micro');
    setMicroFile(null);
    setMicroPreview('');
    setMicroMode(null);
    setMicroDemoId('');
    setData(null);
  };

  const resetMacroSelection = () => {
    clearPreviewUrl('macro');
    setMacroFile(null);
    setMacroPreview('');
    setMacroMode(null);
    setMacroDemoId('');
    resetMicroSelection();
    setData(null);
  };

  const setUploadedFile = (kind, file) => {
    const previewUrl = URL.createObjectURL(file);

    clearPreviewUrl(kind);

    if (kind === 'macro') {
      macroObjectUrlRef.current = previewUrl;
      setMacroFile(file);
      setMacroPreview(previewUrl);
      setMacroMode('upload');
      setMacroDemoId('');
      resetMicroSelection();
      return;
    }

    microObjectUrlRef.current = previewUrl;
    setMicroFile(file);
    setMicroPreview(previewUrl);
    setMicroMode('upload');
    setMicroDemoId('');
  };

  const setPreferredFile = async (kind, item) => {
    const demoFile = await assetPathToFile(item.assetPath, item.fileName);

    clearPreviewUrl(kind);

    if (kind === 'macro') {
      setMacroFile(demoFile);
      setMacroPreview(item.assetPath);
      setMacroMode('preferred');
      setMacroDemoId(item.id);
      resetMicroSelection();
      return;
    }

    setMicroFile(demoFile);
    setMicroPreview(item.assetPath);
    setMicroMode('preferred');
    setMicroDemoId(item.id);
  };

  const assignUploadedImage = (kind, file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload image files only.');
      return;
    }

    setErrorMessage('');
    setData(null);
    setUploadedFile(kind, file);
  };

  const handleInputChange = (kind) => (event) => {
    const selectedFile = event.target.files?.[0] || null;
    assignUploadedImage(kind, selectedFile);
  };

  const handlePreferredSelect = (kind) => async (item) => {
    try {
      setErrorMessage('');
      setData(null);
      await setPreferredFile(kind, item);
    } catch (error) {
      console.error('Preferred image selection failed', error);
      setErrorMessage(error.message || 'Failed to load the preferred image.');
    }
  };

  const handlePreferredPreview = (item) => {
    setActiveVisual({
      title: item.title,
      src: item.assetPath,
    });
  };

  const handleDragState = (kind) => (event) => {
    event.preventDefault();
    setDragTarget(kind);
  };

  const clearDragState = (kind) => (event) => {
    event.preventDefault();
    if (dragTarget === kind) {
      setDragTarget('');
    }
  };

  const handleDrop = (kind) => (event) => {
    event.preventDefault();
    setDragTarget('');
    const droppedFile = event.dataTransfer.files?.[0] || null;
    assignUploadedImage(kind, droppedFile);
  };

  const handleAnalyze = async () => {
    if (!macroFile || !microFile) {
      setErrorMessage('Choose both the macro image and the micro image before generating the report.');
      return;
    }

    setLoading(true);
    setData(null);
    setErrorMessage('');

    const formData = new FormData();
    formData.append('macro_file', macroFile);
    formData.append('micro_file', microFile);

    try {
      const response = await fetch('https://lowen-backend-production.up.railway.app/analyze', {
        method: 'POST',
        body: formData,
      });

      let result = null;

      try {
        result = await response.json();
      } catch {
        throw new Error('The backend returned an unreadable response.');
      }

      if (!response.ok) {
        throw new Error(result?.detail || result?.message || 'Analysis failed before a valid report was returned.');
      }

      setData(result);
    } catch (error) {
      console.error('Analysis failed', error);
      setErrorMessage(error.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const results = data?.results || {};
  const visuals = data?.visuals || {};
  const graphicType = getGraphicType(results.fleet_owner);
  const dimensionValue =
    results.length_ft !== undefined && results.length_ft !== null &&
    results.height_ft !== undefined && results.height_ft !== null
      ? `${results.length_ft}' × ${results.height_ft}'`
      : 'Unavailable';

  const macroPanelLockedToPreferred = macroMode === 'preferred';
  const macroPreferredDisabled = macroMode === 'upload';
  const microEnabled = Boolean(macroFile);
  const microUploadDisabled = !microEnabled || macroMode === 'preferred' || microMode === 'preferred';
  const microPreferredDisabled = !selectedMacroGroup || microMode === 'upload';

  return (
    <div className="app-shell">
      <main className="app-frame">
        <div className="workflow-frame">
          <header className="page-header">
            <div className="page-header__topbar">
              <div className="page-header__brand">
                <span className="page-header__brand-mark">L</span>
                <div>
                  <p className="eyebrow">Lowen Corp AI Logistics</p>
                  <span>Production quoting interface</span>
                </div>
              </div>

              <div className="page-header__utility">
                <a
                  className="page-header__link"
                  href="https://docs.google.com/document/d/1jzvdpXkaEDFYFblJVMswZXq4yJH7lCPqeBb7itu2dyg/edit?usp=sharing"
                  target="_blank"
                  rel="noreferrer"
                >
                  Detailed Project Implementation Document
                </a>
              </div>
            </div>

            <div className="page-header__hero">
              <div className="page-header__copy">
                <h1>Measure trailer graphics from two images with proof-ready output.</h1>
                <p className="page-header__summary">
                  Calibrate scale from the tape close-up, flatten the trailer side, and return
                  billable ink evidence without slowing down estimating.
                </p>
              </div>

              <div className="page-header__signals">
                {headerSignals.map((signal) => (
                  <span key={signal}>{signal}</span>
                ))}
              </div>
            </div>
          </header>

          <section className="assumptions-panel">
            <div className="assumptions-panel__header">
              <div>
                <p className="eyebrow">Demo assumptions</p>
                <h2>What the current model expects from the images you submit.</h2>
              </div>
              <p className="assumptions-panel__summary">
                These constraints keep the demo consistent across uploads and preferred image sets.
              </p>
            </div>

            <ol className="assumptions-grid">
              {DEMO_ASSUMPTIONS.map((assumption, index) => (
                <li key={assumption} className="assumption-card">
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <p>{assumption}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="input-grid">
            <div className="input-panel">
              <UploadDropArea
                panelTitle="Macro Image (Whole Trailer Image)"
                panelSubtitle="Use the full trailer side for geometry and perspective correction."
                description="Drag or upload images. Prefer using the demo macro images below."
                disabledMessage="Clear the preferred selection to upload your own image."
                inputId="macro-upload"
                disabled={macroPanelLockedToPreferred}
                lockedMode={macroMode}
                file={macroFile}
                preview={macroPreview}
                onFileChange={handleInputChange('macro')}
                onDrop={handleDrop('macro')}
                onDragEnter={handleDragState('macro')}
                onDragLeave={clearDragState('macro')}
                onDragOver={handleDragState('macro')}
                onReset={resetMacroSelection}
                isDragging={dragTarget === 'macro'}
              />

              <PreferredImagePanel
                title="Preferred demo images"
                badge="Recommended"
                hint="Fastest way to try the workflow. Start with one of these prepared trailer samples."
                items={DEMO_IMAGE_GROUPS.map((group) => group.macro)}
                selectedId={macroDemoId}
                disabled={macroPreferredDisabled}
                emptyMessage="Add macro demo images in src/demoImageCatalog.js."
                onSelect={handlePreferredSelect('macro')}
                onView={handlePreferredPreview}
              />
            </div>

            <div className="input-panel">
              <UploadDropArea
                panelTitle="Micro Image (Tape Close Up)"
                panelSubtitle="Use the tape close-up to lock scale for the trailer measurements."
                description="Drag or upload images once the macro image has been chosen."
                disabledMessage={
                  !microEnabled
                    ? 'Choose the macro image first to unlock this field.'
                    : macroMode === 'preferred'
                      ? 'This macro image came from the preferred set. Choose one of the matched micro images below.'
                      : 'Clear the preferred selection to upload your own image.'
                }
                inputId="micro-upload"
                disabled={microUploadDisabled}
                lockedMode={microMode}
                file={microFile}
                preview={microPreview}
                onFileChange={handleInputChange('micro')}
                onDrop={handleDrop('micro')}
                onDragEnter={handleDragState('micro')}
                onDragLeave={clearDragState('micro')}
                onDragOver={handleDragState('micro')}
                onReset={resetMicroSelection}
                isDragging={dragTarget === 'micro'}
              />

              <PreferredImagePanel
                title="Preferred demo images"
                badge="Matched set"
                hint={
                  selectedMacroGroup
                    ? 'These tape close-ups are matched to the trailer image you selected above.'
                    : 'Choose a preferred macro image above to unlock the matched tape close-ups here.'
                }
                items={availableMicroDemos}
                selectedId={microDemoId}
                disabled={microPreferredDisabled}
                emptyMessage={
                  selectedMacroGroup
                    ? 'No mapped micro demo images are configured for this macro image yet.'
                    : 'Choose a preferred macro image first to unlock its mapped micro images.'
                }
                onSelect={handlePreferredSelect('micro')}
                onView={handlePreferredPreview}
              />
            </div>
          </section>

          {errorMessage ? <div className="message-banner message-banner--error">{errorMessage}</div> : null}

          {loading ? (
            <div className="loading-strip" aria-live="polite">
              Building scale, corrected geometry, printable ink coverage, and proof images...
            </div>
          ) : null}

          <div className="generate-row">
            <button type="button" className="generate-button" onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Generating report...' : 'Generate report'}
            </button>
          </div>
        </div>

        {data ? (
          <section className="analysis-frame" ref={resultsRef}>
            <h2 className="analysis-title">Analysis report:</h2>

            <div className="analysis-metrics">
              <MetricCard
                label="Fleet owner"
                value={formatMetric(results.fleet_owner)}
                note="Detected from the trailer branding in the source image."
                accent="teal"
              />
              <MetricCard
                label="Total area"
                value={formatMetric(results.total_area_sqft, ' sqft')}
                note="Calculated from the corrected trailer side used for quoting."
                accent="blue"
              />
              <MetricCard
                label="Billable ink"
                value={formatMetric(results.ink_yield_sqft, ' sqft')}
                note="Estimated printable coverage after graphics isolation."
                accent="amber"
              />
              <MetricCard
                label="Dimensions"
                value={dimensionValue}
                note="Length and height derived from calibrated image scale."
                accent="rose"
              />
              <MetricCard
                label="Graphic type"
                value={graphicType}
                note="Derived from the detected fleet logo category."
                accent="blue"
              />
            </div>

            <div className="visual-section">
              <h3>Visual Checkpoints:</h3>
              <div className="visual-grid">
                {evidenceCards.map((card) => (
                  <EvidenceCard
                    key={card.key}
                    title={card.title}
                    description={card.description}
                    src={visuals[card.key] ? `data:image/jpeg;base64,${visuals[card.key]}` : ''}
                    onOpen={setActiveVisual}
                  />
                ))}
              </div>
            </div>

            <div className="improvement-panel">
              <h3>What can be done better if given time:</h3>
            </div>
          </section>
        ) : null}
      </main>

      {activeVisual ? (
        <div className="image-modal" role="dialog" aria-modal="true" aria-label={activeVisual.title}>
          <button type="button" className="image-modal__backdrop" onClick={() => setActiveVisual(null)} />
          <div className="image-modal__content">
            <div className="image-modal__header">
              <h3>{activeVisual.title}</h3>
              <button type="button" className="ghost-button" onClick={() => setActiveVisual(null)}>
                Close
              </button>
            </div>
            <div className="image-modal__frame">
              <img src={activeVisual.src} alt={activeVisual.title} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default App;
