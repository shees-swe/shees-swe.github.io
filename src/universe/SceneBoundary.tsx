import { Component, type ReactNode } from 'react';

/**
 * If WebGL is unavailable (or the scene throws), render nothing. Every piece of
 * content on the page is ordinary DOM, so the site stays fully usable.
 */
export default class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
