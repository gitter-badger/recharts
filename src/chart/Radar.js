import React, { PropTypes } from 'react';
import ReactUtils from '../util/ReactUtils';
import Polygon from '../shape/Polygon';
import Dot from '../shape/Dot';
import Layer from '../container/Layer';

class Radar extends React.Component {

  static displayName = 'Radar';

  static propTypes = {
    className: PropTypes.string,
    dataKey: PropTypes.string.isRequired,

    points: PropTypes.arrayOf(PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      cx: PropTypes.number,
      cy: PropTypes.number,
      angle: PropTypes.number,
      radius: PropTypes.number,
      value: PropTypes.number,
      payload: PropTypes.object,
    })),
    shape: PropTypes.element,
    dot: PropTypes.oneOfType([PropTypes.element, PropTypes.object, PropTypes.bool]),
    label: PropTypes.oneOfType([PropTypes.element, PropTypes.object, PropTypes.bool]),
  };

  static defaultProps = {
    dot: true,
    label: true,
  };

  renderPolygon() {
    const { shape } = this.props;
    const isShapeElement = React.isValidElement(shape);

    return isShapeElement ?
           React.cloneElement(shape, this.props) :
           React.createElement(Polygon, this.props);
  }

  renderLabels() {
    const { points, label } = this.props;
    const baseProps = ReactUtils.getPresentationAttributes(this.props);
    const customLabelProps = ReactUtils.getPresentationAttributes(label);
    const isLabelElement = React.isValidElement(label);

    const labels = points.map((entry, i) => {
      const labelProps = {
        textAnchor: 'middle',
        ...entry,
        ...baseProps,
        ...customLabelProps,
        index: i,
        key: `label-${i}`,
        payload: entry,
      };

      return isLabelElement ? React.cloneElement(label, labelProps) : (
        <text {...labelProps}>{entry.value}</text>
      );
    });

    return <Layer className="recharts-layer-area-labels">{labels}</Layer>;
  }

  renderDots() {
    const { dot, points } = this.props;
    const baseProps = ReactUtils.getPresentationAttributes(this.props);
    const customDotProps = ReactUtils.getPresentationAttributes(dot);
    const isDotElement = React.isValidElement(dot);

    const dots = points.map((entry, i) => {
      const dotProps = {
        key: `dot-${i}`,
        r: 3,
        ...baseProps,
        ...customDotProps,
        cx: entry.x,
        cy: entry.y,
        index: i,
        playload: entry,
      };

      return isDotElement ? React.cloneElement(dot, dotProps) : <Dot {...dotProps}/>;
    });

    return <Layer className="recharts-layer-area-dots">{dots}</Layer>;
  }

  render() {
    const { points, label, dot } = this.props;

    if (!points || !points.length) {return null;}

    return (
      <Layer className="recharts-radar">
        {this.renderPolygon()}
        {label && this.renderLabels()}
        {dot && this.renderDots()}
      </Layer>
    );
  }
}

export default Radar;
