import React from 'react';
import { mount } from 'enzyme';
import { noop } from 'lodash';

import Send from 'browser/components/RequestsProcessor/Send/Send';

describe('<Send />', () => {
  const txid = '9a560de43649bc4671dcfc522c8a54d176cfd2bb34410e1ac976ddf1f150ab05';
  const defaultProps = { txid, onResolve: noop };

  it('renders nothing', () => {
    const wrapper = mount(<Send {...defaultProps} />);
    expect(wrapper.children()).toHaveLength(0);
  });

  it('calls onResolve with txid', () => {
    const onResolve = jest.fn();
    mount(<Send {...defaultProps} onResolve={onResolve} />);
    expect(onResolve).toHaveBeenCalledWith(txid);
  });
});
