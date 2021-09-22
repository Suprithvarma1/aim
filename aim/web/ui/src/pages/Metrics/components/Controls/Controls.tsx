import React from 'react';

import AggregationPopup from 'components/AggregationPopover/AggregationPopover';
import SmootheningPopup from 'components/SmoothingPopover/SmoothingPopover';
import ZoomInPopup from 'components/ZoomInPopover/ZoomInPopover';
import ZoomOutPopup from 'components/ZoomOutPopover/ZoomOutPopover';
import HighlightModePopup from 'components/HighlightModesPopover/HighlightModesPopover';
import ControlPopover from 'components/ControlPopover/ControlPopover';
import AxesScalePopover from 'components/AxesScalePopover/AxesScalePopover';
import AlignmentPopover from 'components/AlignmentPopover/AlignmentPopover';
import TooltipContentPopover from 'components/TooltipContentPopover/TooltipContentPopover';
// @ts-ignore
import { IControlProps } from 'types/pages/metrics/components/Controls/Controls';
import Icon from 'components/Icon/Icon';
import { Tooltip } from '@material-ui/core';

import './Controls.scss';

function Controls(
  props: IControlProps,
): React.FunctionComponentElement<React.ReactNode> {
  return (
    <div className='Controls__container ScrollBar__hidden'>
      <div>
        <ControlPopover
          title='Select Aggregation Method'
          open={!!props.aggregationConfig.isEnabled}
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip
              title={
                props.aggregationConfig.isApplied
                  ? 'Deaggregate Metrics'
                  : 'Aggregate Metrics'
              }
            >
              <div
                className={`Controls__anchor ${
                  props.aggregationConfig.isApplied ? 'active outlined' : ''
                } ${props.aggregationConfig.isEnabled ? '' : 'disabled'}`}
              >
                {props.aggregationConfig.isEnabled ? (
                  <span
                    className={`Controls__anchor__arrow ${
                      opened ? 'Controls__anchor__arrow__opened' : ''
                    }`}
                    onClick={onAnchorClick}
                  >
                    <Icon name='arrow-left' onClick={onAnchorClick} />
                  </span>
                ) : null}
                <Icon
                  className={`Controls__icon ${
                    props.aggregationConfig.isApplied ? 'active' : ''
                  }`}
                  name='aggregation'
                  onClick={() => {
                    if (props.aggregationConfig.isEnabled) {
                      props.onAggregationConfigChange({
                        isApplied: !props.aggregationConfig?.isApplied,
                      });
                    }
                  }}
                />
              </div>
            </Tooltip>
          )}
          component={
            <AggregationPopup
              aggregationConfig={props.aggregationConfig}
              onChange={props.onAggregationConfigChange}
            />
          }
        />
      </div>
      <div>
        <ControlPopover
          title='Align X-Axis by'
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip title='Align X-Axis'>
              <div
                onClick={onAnchorClick}
                className={`Controls__anchor ${opened ? 'active' : ''}`}
              >
                <Icon
                  className={`Controls__icon ${opened ? 'active' : ''}`}
                  name='x-axis'
                />
              </div>
            </Tooltip>
          )}
          component={
            <AlignmentPopover
              projectsDataMetrics={props.projectsDataMetrics}
              alignmentConfig={props.alignmentConfig}
              onAlignmentMetricChange={props.onAlignmentMetricChange}
              onAlignmentTypeChange={props.onAlignmentTypeChange}
            />
          }
        />
      </div>
      <div>
        <ControlPopover
          title='Axes Scale'
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip title='Axes Scale'>
              <div
                onClick={onAnchorClick}
                className={`Controls__anchor ${opened ? 'active' : ''}`}
              >
                <Icon
                  className={`Controls__icon ${opened ? 'active' : ''}`}
                  name='axes-scale'
                />
              </div>
            </Tooltip>
          )}
          component={
            <AxesScalePopover
              axesScaleType={props.axesScaleType}
              onAxesScaleTypeChange={props.onAxesScaleTypeChange}
            />
          }
        />
      </div>
      <div>
        <ControlPopover
          title='Chart Smoothing Options'
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip title='Chart Smoothing Options'>
              <div
                onClick={onAnchorClick}
                className={`Controls__anchor ${opened ? 'active' : ''}`}
              >
                <Icon
                  className={`Controls__icon ${opened ? 'active' : ''}`}
                  name='smoothing'
                />
              </div>
            </Tooltip>
          )}
          component={
            <SmootheningPopup
              onSmoothingChange={props.onSmoothingChange}
              smoothingAlgorithm={props.smoothingAlgorithm}
              curveInterpolation={props.curveInterpolation}
              smoothingFactor={props.smoothingFactor}
            />
          }
        />
      </div>
      <Tooltip
        title={
          props.ignoreOutliers ? 'Outliers Are Ignored' : 'Ignore Outliers'
        }
      >
        <div
          className={`Controls__anchor ${
            props.ignoreOutliers ? 'active outlined' : ''
          }`}
          onClick={props.onIgnoreOutliersChange}
        >
          {props.ignoreOutliers ? (
            <Icon
              className={`Controls__icon ${
                props.ignoreOutliers ? 'active' : ''
              }`}
              name='ignore-outliers'
            />
          ) : (
            <Icon className='Controls__icon' name='ignore-outliers' />
          )}
        </div>
      </Tooltip>
      <div>
        <ControlPopover
          title='Highlight Modes'
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip title='Highlight Modes'>
              <div
                className={`Controls__anchor ${opened ? 'active' : ''}`}
                onClick={onAnchorClick}
              >
                <Icon
                  className={`Controls__icon ${opened ? 'active' : ''}`}
                  name='highlight-mode'
                />
              </div>
            </Tooltip>
          )}
          component={
            <HighlightModePopup
              mode={props.highlightMode}
              onChange={props.onHighlightModeChange}
            />
          }
        />
      </div>
      <div>
        <ControlPopover
          title='Select Tooltip Params'
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip title='Tooltip Params'>
              <div
                onClick={onAnchorClick}
                className={`Controls__anchor ${opened ? 'active' : ''}`}
              >
                <Icon
                  className={`Controls__icon ${opened ? 'active' : ''}`}
                  name='cursor'
                />
              </div>
            </Tooltip>
          )}
          component={
            <TooltipContentPopover
              selectOptions={props.selectOptions}
              selectedParams={props.tooltip.selectedParams}
              displayTooltip={props.tooltip.display}
              onChangeTooltip={props.onChangeTooltip}
            />
          }
        />
      </div>
      <div>
        <ControlPopover
          title='Select Zoom Mode'
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip title='Zoom In'>
              <div
                className={`Controls__anchor ${
                  props.zoom?.active ? 'active' : ''
                }`}
              >
                <span
                  className={`Controls__anchor__arrow ${
                    opened ? 'Controls__anchor__arrow__opened' : ''
                  }`}
                  onClick={onAnchorClick}
                >
                  <Icon name='arrow-left' />
                </span>
                <span
                  onClick={() => {
                    if (props.zoom) {
                      props.onZoomChange?.({ active: !props.zoom.active });
                    }
                  }}
                >
                  <Icon
                    className={`Controls__icon ${
                      props.zoom?.active ? 'active' : ''
                    }`}
                    name='zoom-in'
                  />
                </span>
              </div>
            </Tooltip>
          )}
          component={
            <ZoomInPopup
              mode={props.zoom?.mode}
              onChange={props.onZoomChange}
            />
          }
        />
      </div>
      <div>
        <ControlPopover
          title='Select Option To Zoom Out'
          open={!!props.zoom?.history.length}
          anchor={({ onAnchorClick, opened }) => (
            <Tooltip title='Zoom Out'>
              <div
                className={`Controls__anchor ${
                  props.zoom?.history.length ? '' : 'disabled'
                }`}
              >
                {props.zoom?.history.length ? (
                  <span
                    className={`Controls__anchor__arrow ${
                      opened ? 'Controls__anchor__arrow__opened' : ''
                    }`}
                    onClick={onAnchorClick}
                  >
                    <Icon name='arrow-left' />
                  </span>
                ) : null}
                <span
                  onClick={() => {
                    if (props.zoom?.history.length) {
                      props.onZoomChange?.({
                        history: [...props.zoom.history].slice(0, -1),
                      });
                    }
                  }}
                >
                  <Icon className='Controls__icon' name='zoom-out' />
                </span>
              </div>
            </Tooltip>
          )}
          component={
            <ZoomOutPopup
              zoomHistory={props.zoom?.history}
              onChange={props.onZoomChange}
            />
          }
        />
      </div>
    </div>
  );
}

export default Controls;