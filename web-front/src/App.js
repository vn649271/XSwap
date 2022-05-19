import React from 'react';
import './App.scss';
import './header.scss';
import Web3 from 'web3';
import { DebounceInput } from 'react-debounce-input';
// import { Modal } from 'antd';
import 'antd/dist/antd.css';
import is_selected from './images/is_selected.svg';
import exchange from './images/exchange.svg';
import exchange_mob from './images/exchange_mob.svg';
import show_tips from './images/show-tips.svg';
import imBTC from './images/imBTC.svg';
import HBTC from './images/HBTC.svg';
import USDx from './images/USDx.svg';
import USDT from './images/USDT.svg';
import WETH from './images/WETH.svg';
import WBTC from './images/WBTC.svg';
import DAI from './images/DAI.svg';
import HUSD from './images/HUSD.svg';
import BUSD from './images/BUSD.svg';
import logo_xswap from './images/logo-dforce.svg';
import close from './images/close.svg';
import close_new from './images/close-new.svg';
// png
import usdc from './images/usdc.png';
import tusd from './images/tusd.png';
import pax from './images/pax.png';
// add i18n.
import { IntlProvider, FormattedMessage } from 'react-intl';
import en_US from './language/en_US.js';
import zh_CN from './language/zh_CN';
import History from './component/history';
import Top from './component/top';

import Twitter from './images/twitter.svg';
import Telegram from './images/telegram.svg';
import Medium from './images/medium.svg';
import Reddit from './images/Reddit.svg';
import Discord from './images/Discord.svg';
import LinkedIn from './images/LinkedIn.svg';
import Youtube from './images/Youtube.svg';
import erweima from './images/erweima.png';
import weixin from './images/weixin.svg';
import arrow_u from './images/up.svg';
import logo_goldx from './images/logo_goldx.svg';

import arrow_d from './images/arrow_d.svg';
import img_is_open from './images/img_is_open.svg';
import { Menu, Dropdown, Drawer, Collapse, Modal } from 'antd';
import {
  get_my_balance,
  handle_A_change,
  handle_B_change,
  get_data_first,
  format_bn,
  swap_click,
  swapTo_click,
  get_exchange__get_fee,
  handle_A_max,
  format_num_to_K,
  handle_B_max,
  check_TokensEnable,
  handle_A_change_ttt
} from './utils.js';

let tokens_abi = require('./abi/tokensABI.json');
let xSwap_abi = require('./abi/xSwapABI.json');
let address_map = require('./abi/address_map.json');


export default class App extends React.Component {
  constructor(porps) {
    super(porps);

    let url_to_arr = window.location.href.split('/');
    let trans_token;
    url_to_arr.map(item => {
      if (item.includes('-')) {
        trans_token = item;
      }
    })
    // console.log(trans_token);
    trans_token = this.handle_trans_token(trans_token);
    console.log(trans_token);

    this.state = {
      cur_send_addr: trans_token ? trans_token.split('-')[0] : 'USDT',
      cur_recive_addr: trans_token ? trans_token.split('-')[1] : 'USDx',

      data_is_ok: false,
      token: {
        WETH: WETH,
        imBTC: imBTC,
        USDT: USDT,
        USDx: USDx,
        HBTC: HBTC,
        USDC: usdc,
        TUSD: tusd,
        PAX: pax,
        WBTC: WBTC,
        DAI: DAI,
        WBTC: WBTC,
        HUSD: HUSD,
        BUSD: BUSD,
        GOLDx: logo_goldx
      },
      decimals: {
        HUSD: 8,
        BUSD: 18,
        USDx: 18,
        TUSD: 18,
        PAX: 18,
        DAI: 18,
        USDC: 6,
        USDT: 6,
        imBTC: 8,
        HBTC: 18,
        WBTC: 8,
        GOLDx: 18
      },
      cur_language: navigator.language === 'zh-CN' ? '中文' : 'English',
      show_left_more_token: false,
      showonly: false,
      meun1: true,
      meun2: true,
      meun3: true,
      is_open: true,
      token_list: ['HUSD', 'BUSD', 'USDx', 'TUSD', 'PAX', 'DAI', 'USDC', 'USDT', 'imBTC', 'HBTC', 'WBTC', 'GOLDx']
    }

    if (!Web3.givenProvider) {
      return console.log('no givenProvider');
    }

    this.new_web3 = window.new_web3 = new Web3(Web3.givenProvider || null);
    this.bn = this.new_web3.utils.toBN;

    this.init_wallet();
  }


  init_wallet = () => {
    this.new_web3.eth.net.getNetworkType().then(
      (net_type) => {
        console.log(net_type);
        let HBTC = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['HBTC']);
        let HUSD = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['HUSD']);
        let BUSD = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['BUSD']);
        // let imBTC = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['imBTC']);
        let WBTC = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['WBTC']);
        let XSwap_stable = new this.new_web3.eth.Contract(xSwap_abi, address_map[net_type]['XSwap_stable']);
        let XSwap_btc = new this.new_web3.eth.Contract(xSwap_abi, address_map[net_type]['XSwap_btc']);
        let USDx = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['USDx']);
        let USDT = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['USDT']);
        let USDC = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['USDC']);
        let PAX = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['PAX']);
        let TUSD = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['TUSD']);
        let DAI = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['DAI']);
        let GOLDx = new this.new_web3.eth.Contract(tokens_abi, address_map[net_type]['GOLDx']);
        console.log(' *** init contract finished *** ');
        this.setState({
          net_type: net_type,
          XSwap_stable: XSwap_stable,
          XSwap_btc: XSwap_btc,
          USDx: USDx,
          // imBTC: imBTC,
          USDT: USDT,
          HBTC: HBTC,
          USDC: USDC,
          PAX: PAX,
          TUSD: TUSD,
          DAI: DAI,
          WBTC: WBTC,
          HUSD: HUSD,
          BUSD: BUSD,
          GOLDx: GOLDx,
          is_from_right_input: false
        }, () => {
          this.new_web3.givenProvider.enable().then((res_accounts) => {
            console.log(res_accounts[0]);
            this.setState({
              my_account: res_accounts[0],
              load_new_history: Math.random()
            }, () => {
              this.state.XSwap_stable.methods.isOpen().call((err, res_isopen_stable) => {
                this.state.XSwap_btc.methods.isOpen().call((err, res_isopen_btc) => {
                  // console.log(res_isopen_stable, res_isopen_btc);
                  if (res_isopen_stable && res_isopen_btc) {
                    this.setState({
                      i_am_ready: true,
                      is_open: true
                    })

                    let url_to_arr = window.location.href.split('/');
                    let trans_token;
                    url_to_arr.map(item => {
                      if (item.includes('-')) {
                        trans_token = item;
                      }
                    })
                    // console.log(trans_token);
                    trans_token = this.handle_trans_token(trans_token);
                    console.log(trans_token);
                    if (
                      trans_token &&
                      this.state.token_list.includes(trans_token.split('-')[0]) &&
                      this.state.token_list.includes(trans_token.split('-')[1]) &&
                      (trans_token.split('-')[0] !== trans_token.split('-')[1])
                    ) {
                      this.setState({
                        cur_send_contract: this.state[trans_token.split('-')[0]],
                        cur_recive_contract: this.state[trans_token.split('-')[1]],
                        cur_send_addr: trans_token.split('-')[0],
                        cur_recive_addr: trans_token.split('-')[1],
                        cur_send_decimals: this.state.decimals[trans_token.split('-')[0]],
                        cur_recive_decimals: this.state.decimals[trans_token.split('-')[1]],
                        is_stable_coin_send: this.checkIsStableCoin(trans_token),
                        is_stable_coin_receive: this.checkIsStableCoin(trans_token),
                      }, () => {
                        get_data_first(
                          this,
                          address_map[net_type]['XSwap_stable'],
                          address_map[this.state.net_type][this.state.cur_send_addr],
                          address_map[this.state.net_type][this.state.cur_recive_addr]
                        );
                      })
                    } else {
                      this.setState({
                        cur_send_contract: USDT,
                        cur_recive_contract: USDx,
                        cur_send_addr: 'USDT',
                        cur_recive_addr: 'USDx',
                        cur_send_decimals: 6,
                        cur_recive_decimals: 18,
                        is_stable_coin_send: true,
                        is_stable_coin_receive: true,
                      }, () => {
                        get_data_first(
                          this,
                          address_map[net_type]['XSwap_stable'],
                          address_map[this.state.net_type][this.state.cur_send_addr],
                          address_map[this.state.net_type][this.state.cur_recive_addr]
                        );
                      })
                    }

                    get_my_balance(this);
                    check_TokensEnable(this);
                    this.accountsChangedEvent();
                  } else {
                    // alert(!(res_isopen_stable && res_isopen_btc));
                    this.setState({
                      i_am_ready: false,
                      is_open: false
                    })
                  }
                })
              })
            })
          })
        })
      }
    )
  }


  // add accounts changed
  accountsChangedEvent = () => {
    if (window.ethereum.on) {
      window.ethereum.on('accountsChanged', (accounts) => {
        // console.log('accountsChanged: ', accounts[0]);
        this.setState({
          my_account: accounts[0],
          side_A_amount: '',
          is_wap_enable: false,
          side_B_amount: '',
          is_Insufficient_Balance: false,
          is_liquidity_limit: false
        }, () => {
          console.log(this.state.my_account);
          if (!this.state.my_account || !this.state.net_type) {
            return;
          }

          let url_to_arr = window.location.href.split('/');
          let trans_token;
          url_to_arr.map(item => {
            if (item.includes('-')) {
              trans_token = item;
            }
          })
          trans_token = this.handle_trans_token(trans_token);
          if (
            trans_token &&
            this.state.token_list.includes(trans_token.split('-')[0]) &&
            this.state.token_list.includes(trans_token.split('-')[1]) &&
            (trans_token.split('-')[0] !== trans_token.split('-')[1])
          ) {
            this.setState({
              cur_send_contract: this.state.GOLDx,
              cur_recive_contract: this.state.USDT,
              cur_send_addr: 'GOLDx',
              cur_recive_addr: 'USDT',
              cur_send_decimals: 18,
              cur_recive_decimals: 6,
              is_stable_coin_send: this.checkIsStableCoin(trans_token),
              is_stable_coin_receive: this.checkIsStableCoin(trans_token),
            }, () => {
              get_data_first(
                this,
                address_map[this.state.net_type]['XSwap_stable'],
                address_map[this.state.net_type][this.state.cur_send_addr],
                address_map[this.state.net_type][this.state.cur_recive_addr]
              );
            })
          } else {
            this.setState({
              cur_send_contract: this.state.USDT,
              cur_recive_contract: this.state.USDx,
              cur_send_addr: 'USDT',
              cur_recive_addr: 'USDx',
              cur_send_decimals: 6,
              cur_recive_decimals: 18,
              is_stable_coin_send: true,
              is_stable_coin_receive: true,
            }, () => {
              get_data_first(
                this,
                address_map[this.state.net_type]['XSwap_stable'],
                address_map[this.state.net_type][this.state.cur_send_addr],
                address_map[this.state.net_type][this.state.cur_recive_addr]
              );
            })
          }

          get_my_balance(this);
          this.setState({
            load_new_history: Math.random()
          });
        })
      });
    }
  }

  checkIsStableCoin = (trans_token) => {
    if (!trans_token) { return true }
    return (
      !(
        (trans_token.split('-')[0] === 'HBTC' || trans_token.split('-')[0] === 'WBTC') &&
        (trans_token.split('-')[1] === 'HBTC' || trans_token.split('-')[1] === 'WBTC')
      )
    )
  }


  handle_trans_token = (trans_token) => {
    if (!trans_token) { return false }
    let token_list = ['HUSD', 'BUSD', 'USDx', 'TUSD', 'PAX', 'DAI', 'USDC', 'USDT', 'imBTC', 'HBTC', 'WBTC', 'GOLDx'];

    if (trans_token.includes('?')) {
      let trans_token_arr = trans_token.split('?');
      for (let i = 0; i < trans_token_arr.length; i++) {
        if (trans_token_arr[i].includes('-') && token_list.includes(this.handle_token_sylbal(trans_token_arr[i].split('-')[0]))) {
          trans_token = trans_token_arr[i]
        }
      }
    }

    if (trans_token.split('-')[0] && trans_token.split('-')[1]) {
      let part_a = trans_token.split('-')[0];
      let part_b = trans_token.split('-')[1];

      part_a = this.handle_token_sylbal(part_a);
      part_b = this.handle_token_sylbal(part_b);

      // console.log(this.state);
      let token_list_btc = ['imBTC', 'HBTC', 'WBTC'];
      let token_list_usd = ['HUSD', 'BUSD', 'USDx', 'TUSD', 'PAX', 'DAI', 'USDC', 'USDT', 'GOLDx'];
      if (
        (token_list_btc.includes(part_a) && token_list_usd.includes(part_b)) ||
        (token_list_btc.includes(part_b) && token_list_usd.includes(part_a))
      ) { return false }

      return part_a + '-' + part_b;
    } else {
      return false;
    }
  }

  handle_token_sylbal = (part_a) => {
    if (part_a.toLowerCase() === 'husd') {
      part_a = 'HUSD'
    } else if (part_a.toLowerCase() === 'busd') {
      part_a = 'BUSD'
    } else if (part_a.toLowerCase() === 'usdx') {
      part_a = 'USDx'
    } else if (part_a.toLowerCase() === 'tusd') {
      part_a = 'TUSD'
    } else if (part_a.toLowerCase() === 'pax') {
      part_a = 'PAX'
    } else if (part_a.toLowerCase() === 'dai') {
      part_a = 'DAI'
    } else if (part_a.toLowerCase() === 'usdc') {
      part_a = 'USDC'
    } else if (part_a.toLowerCase() === 'usdt') {
      part_a = 'USDT'
    } else if (part_a.toLowerCase() === 'imbtc') {
      part_a = 'imBTC'
    } else if (part_a.toLowerCase() === 'hbtc') {
      part_a = 'HBTC'
    } else if (part_a.toLowerCase() === 'wbtc') {
      part_a = 'WBTC'
    } else if (part_a.toLowerCase() === 'goldx') {
      part_a = 'GOLDx'
    }

    return part_a;
  }


  change_send_addr = (token) => {
    console.log(token);
    var t_bool;
    var t_cur_recive_addr;

    this.setState({
      show_left_more_token: false,
      side_A_amount: '',
      side_B_amount: '',
      is_Insufficient_Balance: false,
      is_liquidity_limit: false
    });
    if (token === 'kong') {
      return false;
    }

    if (token === 'imBTC' || token === 'HBTC' || token === 'WBTC') {
      this.setState({
        is_stable_coin_send: false,
        is_stable_coin_receive: false
      });
      t_bool = false;
      // if (token === 'imBTC') {
      //   this.setState({
      //     cur_recive_addr: 'HBTC',
      //     cur_recive_decimals: 18,
      //     cur_recive_contract: this.state.HBTC
      //   });
      //   t_cur_recive_addr = 'HBTC';
      // } else if (token === 'HBTC' || token === 'WBTC') {
      //   this.setState({
      //     cur_recive_addr: 'imBTC',
      //     cur_recive_decimals: 8,
      //     cur_recive_contract: this.state.imBTC
      //   })
      //   t_cur_recive_addr = 'imBTC';
      // }
      if (token === 'HBTC') {
        this.setState({
          cur_recive_addr: 'WBTC',
          cur_recive_decimals: 8,
          cur_recive_contract: this.state.WBTC
        });
        t_cur_recive_addr = 'WBTC';
      } else if (token === 'WBTC') {
        this.setState({
          cur_recive_addr: 'HBTC',
          cur_recive_decimals: 18,
          cur_recive_contract: this.state.HBTC
        });
        t_cur_recive_addr = 'HBTC';
      }
    } else {
      if (!this.state.is_stable_coin_send) {
        if (token === 'USDT' || token === 'USDC' || token === 'PAX' || token === 'TUSD' || token === 'DAI' || token === 'HUSD' || token === 'BUSD' || token === 'GOLDx') {
          this.setState({
            cur_recive_addr: 'USDx',
            cur_recive_decimals: 18,
            cur_recive_contract: this.state.USDx
          })
          t_cur_recive_addr = 'USDx';
        } else {
          this.setState({
            cur_recive_addr: 'USDT',
            cur_recive_decimals: 6,
            cur_recive_contract: this.state.USDT
          })
          t_cur_recive_addr = 'USDT';
        }
      }
      this.setState({
        is_stable_coin_send: true,
        is_stable_coin_receive: true
      });
      t_bool = true;
    }

    if (token === 'imBTC') {
      this.setState({
        cur_send_addr: 'imBTC',
        cur_send_decimals: 8,
        cur_send_contract: this.state.imBTC
      })
    } else if (token === 'HBTC') {
      this.setState({
        cur_send_addr: 'HBTC',
        cur_send_decimals: 18,
        cur_send_contract: this.state.HBTC
      })
    } else if (token === 'WBTC') {
      this.setState({
        cur_send_addr: 'WBTC',
        cur_send_decimals: 8,
        cur_send_contract: this.state.WBTC
      })
    } else if (token === 'USDx') {
      this.setState({
        cur_send_addr: 'USDx',
        cur_send_decimals: 18,
        cur_send_contract: this.state.USDx
      })
    } else if (token === 'DAI') {
      this.setState({
        cur_send_addr: 'DAI',
        cur_send_decimals: 18,
        cur_send_contract: this.state.DAI
      })
    } else if (token === 'PAX') {
      this.setState({
        cur_send_addr: 'PAX',
        cur_send_decimals: 18,
        cur_send_contract: this.state.PAX
      })
    } else if (token === 'TUSD') {
      this.setState({
        cur_send_addr: 'TUSD',
        cur_send_decimals: 18,
        cur_send_contract: this.state.TUSD
      })
    } else if (token === 'USDT') {
      this.setState({
        cur_send_addr: 'USDT',
        cur_send_decimals: 6,
        cur_send_contract: this.state.USDT
      })
    } else if (token === 'USDC') {
      this.setState({
        cur_send_addr: 'USDC',
        cur_send_decimals: 6,
        cur_send_contract: this.state.USDC
      })
    } else if (token === 'HUSD') {
      this.setState({
        cur_send_addr: 'HUSD',
        cur_send_decimals: 8,
        cur_send_contract: this.state.HUSD
      })
    } else if (token === 'BUSD') {
      this.setState({
        cur_send_addr: 'BUSD',
        cur_send_decimals: 18,
        cur_send_contract: this.state.BUSD
      })
    } else if (token === 'GOLDx') {
      this.setState({
        cur_send_addr: 'GOLDx',
        cur_send_decimals: 18,
        cur_send_contract: this.state.GOLDx
      })
    }

    if (!t_cur_recive_addr) {
      t_cur_recive_addr = this.state.cur_recive_addr;
    }
    get_exchange__get_fee(
      this,
      address_map[this.state.net_type][token],
      address_map[this.state.net_type][t_cur_recive_addr],
      t_bool
    );
  }
  change_recive_addr = (token) => {
    // console.log(token);
    var t_bool;

    this.setState({
      show_right_more_token: false,
      side_A_amount: '',
      side_B_amount: '',
      is_Insufficient_Balance: false,
      is_liquidity_limit: false
    });
    if (token === 'kong') {
      return false;
    }

    if (token === 'imBTC' || token === 'HBTC' || token === 'WBTC') {
      this.setState({ is_stable_coin_receive: false })
      t_bool = false;
    } else {
      this.setState({ is_stable_coin_receive: true })
      t_bool = true;
    }

    if (token === 'imBTC') {
      this.setState({
        cur_recive_addr: 'imBTC',
        cur_recive_decimals: 8,
        cur_recive_contract: this.state.imBTC
      })
    } else if (token === 'HBTC') {
      this.setState({
        cur_recive_addr: 'HBTC',
        cur_recive_decimals: 18,
        cur_recive_contract: this.state.HBTC
      })
    } else if (token === 'WBTC') {
      this.setState({
        cur_recive_addr: 'WBTC',
        cur_recive_decimals: 8,
        cur_recive_contract: this.state.WBTC
      })
    } else if (token === 'USDx') {
      this.setState({
        cur_recive_addr: 'USDx',
        cur_recive_decimals: 18,
        cur_recive_contract: this.state.USDx
      })
    } else if (token === 'DAI') {
      this.setState({
        cur_recive_addr: 'DAI',
        cur_recive_decimals: 18,
        cur_recive_contract: this.state.DAI
      })
    } else if (token === 'PAX') {
      this.setState({
        cur_recive_addr: 'PAX',
        cur_recive_decimals: 18,
        cur_recive_contract: this.state.PAX
      })
    } else if (token === 'TUSD') {
      this.setState({
        cur_recive_addr: 'TUSD',
        cur_recive_decimals: 18,
        cur_recive_contract: this.state.TUSD
      })
    } else if (token === 'USDT') {
      this.setState({
        cur_recive_addr: 'USDT',
        cur_recive_decimals: 6,
        cur_recive_contract: this.state.USDT
      })
    } else if (token === 'USDC') {
      this.setState({
        cur_recive_addr: 'USDC',
        cur_recive_decimals: 6,
        cur_recive_contract: this.state.USDC
      })
    } else if (token === 'HUSD') {
      this.setState({
        cur_recive_addr: 'HUSD',
        cur_recive_decimals: 8,
        cur_recive_contract: this.state.HUSD
      })
    } else if (token === 'BUSD') {
      this.setState({
        cur_recive_addr: 'BUSD',
        cur_recive_decimals: 18,
        cur_recive_contract: this.state.BUSD
      })
    } else if (token === 'GOLDx') {
      this.setState({
        cur_recive_addr: 'GOLDx',
        cur_recive_decimals: 18,
        cur_recive_contract: this.state.GOLDx
      })
    }

    get_exchange__get_fee(
      this,
      address_map[this.state.net_type][this.state.cur_send_addr],
      address_map[this.state.net_type][token],
      t_bool
    );
  }
  change_send_to_recive = () => {
    // console.log('side_A_amount:', this.state.side_A_amount);
    // console.log('side_B_amount:', this.state.side_B_amount);
    if (!this.state.i_am_ready) { return console.log('no web3') }

    this.setState({
      side_A_amount: '',
      is_wap_enable: false,
      side_B_amount: '',
      is_Insufficient_Balance: false,
      is_liquidity_limit: false
    })

    var t_cur_recive_addr = this.state.cur_recive_addr;
    var t_cur_recive_decimals = this.state.cur_recive_decimals;
    var t_cur_recive_contract = this.state.cur_recive_contract;

    this.setState({
      cur_recive_addr: this.state.cur_send_addr,
      cur_recive_decimals: this.state.cur_send_decimals,
      cur_recive_contract: this.state.cur_send_contract,
      is_stable_coin_send: this.state.is_stable_coin_receive
    }, () => {
      this.setState({
        cur_send_addr: t_cur_recive_addr,
        cur_send_decimals: t_cur_recive_decimals,
        cur_send_contract: t_cur_recive_contract
      }, () => {
        // if (!this.state.side_B_amount) {
        //   return false;
        // }
        // handle_A_change(this.state.side_B_amount, this);
        // this.setState({
        //   side_B_amount: ''
        // });
        get_exchange__get_fee(
          this,
          address_map[this.state.net_type][this.state.cur_send_addr],
          address_map[this.state.net_type][this.state.cur_recive_addr],
          (this.state.cur_send_addr === 'imBTC' || this.state.cur_send_addr === 'HBTC' || this.state.cur_send_addr === 'WBTC') ?
            false : true
        );
      })
    })
  }

  componentDidMount = () => {
    setInterval(() => {
      if (!this.state.my_account) {
        return false;
      }

      // console.log('*** get_my_balance ***');
      get_my_balance(this);
      get_exchange__get_fee(
        this,
        address_map[this.state.net_type][this.state.cur_send_addr],
        address_map[this.state.net_type][this.state.cur_recive_addr],
        (this.state.cur_send_addr === 'imBTC' || this.state.cur_send_addr === 'HBTC' || this.state.cur_send_addr === 'WBTC') ?
          false : true
      );
    }, 1000 * 5);
  }
  before_swap_click = () => {
    if (!this.state.side_A_amount || this.state.is_no_supported) {
      return false;
    }

    if (this.state.is_from_right_input) {
      console.log('*** swapTo ***');
      swapTo_click(
        this,
        address_map[this.state.net_type][this.state.cur_send_addr],
        address_map[this.state.net_type][this.state.cur_recive_addr]
      );
    } else {
      console.log('*** swap ***');
      swap_click(
        this,
        address_map[this.state.net_type][this.state.cur_send_addr],
        address_map[this.state.net_type][this.state.cur_recive_addr]
      );
    }
  }

  connect = () => {
    console.log('click connected');
    if (!Web3.givenProvider) {
      return console.log('no givenProvider');
    }
  }

  clear_open = (e) => {
    // console.log(e);
    // console.log(e.currentTarget);
    if (this.state.show_left_more_token) {
      this.setState({
        show_left_more_token: false
      })
    }
    if (this.state.show_right_more_token) {
      this.setState({
        show_right_more_token: false
      })
    }
  }



  render() {
    return (
      <IntlProvider locale={'en'} messages={this.state.cur_language === '中文' ? zh_CN : en_US} >
        <Modal
          keyboard={false}
          maskClosable={false}
          visible={!this.state.is_open}
          centered={true}
          footer={false}
          closable={false}
        >
          <div className='popup-is-open'>
            <img src={img_is_open} alt='' />
            <div className='popup-is-open-text'>
              Oracle System Maintain, Come back Soon...
            </div>
            <div className='popup-is-open-text'>
              Oracle系统维护，敬请期待...
            </div>
          </div>
        </Modal>

        <div className={'header'}>
          <a href="https://dforce.network/" className={'header__logo'}>
            <img src={logo_xswap} alt="logo" />
          </a>

          <div className={'header__menu'}>
            <Dropdown
              overlay={
                <Menu className={'header__overlay'}>
                  <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://usdx.dforce.network/" className={'header__overlay_item'}>
                      <span>USDx</span>
                      <label>
                        <FormattedMessage id='Portal' />
                      </label>
                    </a>
                  </Menu.Item>
                  <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://markets.dforce.network/" className={'header__overlay_item'}>
                      <span>
                        <FormattedMessage id='Yield_Markets' />
                      </span>
                      <label>
                        <FormattedMessage id='Yield_Markets_detail' />
                      </label>
                    </a>
                  </Menu.Item>

                  <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" href="https://goldx.dforce.network/" className={'header__overlay_item'}>
                      <span>
                        <FormattedMessage id='goldx' />
                      </span>
                      <label>
                        <FormattedMessage id='goldx_detail' />
                      </label>
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <span className={'header__menu_item'}>
                <label><FormattedMessage id='dForce_Stablecoin' /></label>
                <img src={arrow_d} alt="down" />
              </span>
            </Dropdown>


            <Dropdown
              overlay={
                <Menu className={'header__overlay'}>
                  <Menu.Item>
                    <a rel="noopener noreferrer" href="https://trade.dforce.network/" className={'header__overlay_item'}>
                      <span>dForce Trade</span>
                      <label>
                        <FormattedMessage id='Instant_Swap_of_Stable_Assets' />
                      </label>
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <span className={'header__menu_item'}>
                <label>
                  <FormattedMessage id='Exchange_Market' />
                </label>
                <img src={arrow_d} alt="down" />
              </span>
            </Dropdown>


            <Dropdown
              overlay={
                <Menu className={'header__overlay'}>
                  <Menu.Item>
                    <a rel="noopener noreferrer" href="https://airdrop.dforce.network/" className={'header__overlay_item'}>
                      <span>Airdrop</span>
                      <label>
                        <FormattedMessage id='DF_token_distribute_system' />
                      </label>
                    </a>
                  </Menu.Item>
                </Menu>
              }
            >
              <span className={'header__menu_item'}>
                <label>
                  <FormattedMessage id='Governance' />
                </label>
                <img src={arrow_d} alt="down" />
              </span>
            </Dropdown>


            {
              this.state.my_account &&
              <a
                className={'header__menu_wallet'} target="_blank"
                href={
                  this.state.net_type !== 'rinkeby'
                    ? `https://etherscan.com/address/${this.state.my_account}`
                    : `https://rinkeby.etherscan.io/address/${this.state.my_account}`
                }
              >
                <div>
                  <i style={{ backgroundColor: this.state.net_type !== 'rinkeby' ? '#29B6AF' : '#e2bc73' }}></i>
                  {this.state.my_account.slice(0, 4) + '...' + this.state.my_account.slice(-4)}
                </div>
              </a>
            }
            {
              !this.state.my_account &&
              <a className={'header__menu_wallet'} onClick={() => { this.connect() }}>
                <FormattedMessage id='connect' />
              </a>
            }
          </div>
        </div>

        {/* mobile tips */}
        <div className={this.state.showonly ? 'mobile-only' : 'disn'}>
          <div className='wrap-mob'>
            <div className='only-left'>
              <a href="https://dforce.network/" className={'header__logo'}>
                <img src={logo_xswap} alt="logo" />
              </a>
            </div>
            <div className='only-right'>
              <img src={close_new} alt='' onClick={() => { this.setState({ showonly: false }) }} />
            </div>
            <div className='clear'></div>
          </div>
          <div className='only-kong'></div>

          <h1 onClick={() => { this.setState({ meun1: !this.state.meun1 }) }}>
            <FormattedMessage id='dForce_Stablecoin' />
            <span>
              <img src={this.state.meun1 ? arrow_u : arrow_d} />
            </span>
          </h1>
          <div className={this.state.meun1 ? 'meun1' : 'only1px'}>
            <div className='m-item'>
              <a href='https://usdx.dforce.network/' target='_blank' rel="noopener noreferrer">
                <span className='title'>USDx</span>
              </a>
              <span className='details'>
                <FormattedMessage id='Portal' />
              </span>
            </div>
            <div className='m-item'>
              <a href='https://markets.dforce.network/' target='_blank' rel="noopener noreferrer">
                <span className='title'>
                  <FormattedMessage id='Yield_Markets' />
                </span>
              </a>
              <span className='details'>
                <FormattedMessage id='Yield_Markets_detail' />
              </span>
            </div>
            <div className='m-item'>
              <a href='https://goldx.dforce.network/' target='_blank' rel="noopener noreferrer">
                <span className='title'>
                  <FormattedMessage id='goldx' />
                </span>
              </a>
              <span className='details'>
                <FormattedMessage id='goldx_detail' />
              </span>
            </div>
          </div>


          <h1 onClick={() => { this.setState({ meun3: !this.state.meun3 }) }}>
            <FormattedMessage id='Exchange_Market' />
            <span>
              <img src={this.state.meun3 ? arrow_u : arrow_d} />
            </span>
          </h1>
          <div className={this.state.meun3 ? 'meun1' : 'only1px'}>
            <div className='m-item'>
              <a href='https://trade.dforce.network/' rel="noopener noreferrer">
                <span className='title'>dForce Trade</span>
              </a>
              <span className='details'>
                <FormattedMessage id='Instant_Swap_of_Stable_Assets' />
              </span>
            </div>
          </div>


          <h1 onClick={() => { this.setState({ meun2: !this.state.meun2 }) }}>
            <FormattedMessage id='Governance' />
            <span>
              <img src={this.state.meun2 ? arrow_u : arrow_d} />
            </span>
          </h1>
          <div className={this.state.meun2 ? 'meun1' : 'only1px'}>
            <div className='m-item'>
              <a href='https://airdrop.dforce.network/' rel="noopener noreferrer">
                <span className='title'>Airdrop</span>
              </a>
              <span className='details'>
                <FormattedMessage id='DF_token_distribute_system' />
              </span>
            </div>
          </div>

        </div>


        <div className="App" onClick={(e) => { this.clear_open(e) }}>

          <div className='wrap-mob'>
            <div className='only-left'>
              <a href="https://dforce.network/" className={'header__logo'}>
                <img src={logo_xswap} alt="logo" />
              </a>
            </div>
            <div className='only-right'>
              <img src={close} alt='' onClick={() => { this.setState({ showonly: true }) }} />
            </div>
            <div className='clear'></div>
          </div>

          {/* <Top account={this.state.my_account} fn_connect={() => { this.connect() }} /> */}
          <div className="slogon" style={{ letterSpacing: this.state.cur_language === '中文' ? '5px' : '0px' }}>
            <FormattedMessage id='slogon' />
          </div>


          <div className='other-tokens-wrap'>
            {/* left */}
            <div className="other-tokens float-left">
              <div className="token-balance-left">
                <FormattedMessage id='send' />
                {
                  this.state.cur_send_addr === 'USDx' &&
                  <span className="my-balance">
                    {this.state.my_balance_USDx ? format_num_to_K(format_bn(this.state.my_balance_USDx, this.state.decimals.USDx, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'USDT' &&
                  <span className="my-balance">
                    {this.state.my_balance_USDT ? format_num_to_K(format_bn(this.state.my_balance_USDT, this.state.decimals.USDT, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'USDC' &&
                  <span className="my-balance">
                    {this.state.my_balance_USDC ? format_num_to_K(format_bn(this.state.my_balance_USDC, this.state.decimals.USDC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'PAX' &&
                  <span className="my-balance">
                    {this.state.my_balance_PAX ? format_num_to_K(format_bn(this.state.my_balance_PAX, this.state.decimals.PAX, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'TUSD' &&
                  <span className="my-balance">
                    {this.state.my_balance_TUSD ? format_num_to_K(format_bn(this.state.my_balance_TUSD, this.state.decimals.TUSD, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'DAI' &&
                  <span className="my-balance">
                    {this.state.my_balance_DAI ? format_num_to_K(format_bn(this.state.my_balance_DAI, this.state.decimals.DAI, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'WBTC' &&
                  <span className="my-balance">
                    {this.state.my_balance_WBTC ? format_num_to_K(format_bn(this.state.my_balance_WBTC, this.state.decimals.WBTC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'imBTC' &&
                  <span className="my-balance">
                    {this.state.my_balance_imBTC ? format_num_to_K(format_bn(this.state.my_balance_imBTC, this.state.decimals.imBTC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'HBTC' &&
                  <span className="my-balance">
                    {this.state.my_balance_HBTC ? format_num_to_K(format_bn(this.state.my_balance_HBTC, this.state.decimals.HBTC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'HUSD' &&
                  <span className="my-balance">
                    {this.state.my_balance_HUSD ? format_num_to_K(format_bn(this.state.my_balance_HUSD, this.state.decimals.HUSD, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'BUSD' &&
                  <span className="my-balance">
                    {this.state.my_balance_BUSD ? format_num_to_K(format_bn(this.state.my_balance_BUSD, this.state.decimals.BUSD, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_send_addr === 'GOLDx' &&
                  <span className="my-balance">
                    {this.state.my_balance_GOLDx ? format_num_to_K(format_bn(this.state.my_balance_GOLDx, this.state.decimals.GOLDx, 2)) : '···'}
                  </span>
                }
                <span className="my-balance-title">
                  <FormattedMessage id='balance' />:
                </span>
              </div>

              <div className="other-tokens-left">
                <button
                  onClick={() => { this.setState({ show_left_more_token: !this.state.show_left_more_token }) }}
                  onBlur={() => { this.change_send_addr('kong') }}
                >
                  <img alt='' className="token-logo" src={this.state.token[this.state.cur_send_addr]} />
                  <span className="token-title">
                    {this.state.cur_send_addr}
                  </span>
                  <span className={this.state.show_left_more_token ? "token-tips-re" : "token-tips"}></span>

                  {
                    this.state.show_left_more_token &&
                    <div className="more-tokens">
                      {
                        this.state.cur_recive_addr !== 'USDT' && this.state.is_tokensEnable_USDT &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('USDT') }}>
                          <img alt='' className="token-logo" src={this.state.token.USDT} />
                          <span className="token-title">
                            USDT
                          <i>(Tether USD)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'USDT' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'USDx' && this.state.is_tokensEnable_USDx &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('USDx') }}>
                          <img alt='' className="token-logo" src={this.state.token.USDx} />
                          <span className="token-title">
                            USDx
                          <i>(dForce)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'USDx' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'USDC' && this.state.is_tokensEnable_USDC &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('USDC') }}>
                          <img alt='' className="token-logo" src={this.state.token.USDC} />
                          <span className="token-title">
                            USDC
                          <i>(USD//C)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'USDC' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'DAI' && this.state.is_tokensEnable_DAI &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('DAI') }}>
                          <img alt='' className="token-logo" src={this.state.token.DAI} />
                          <span className="token-title">
                            DAI
                          <i>(Dai Stablecoin)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'DAI' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'PAX' && this.state.is_tokensEnable_PAX &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('PAX') }}>
                          <img alt='' className="token-logo" src={this.state.token.PAX} />
                          <span className="token-title">
                            PAX
                          <i>(Paxos Standard)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'PAX' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'HUSD' && this.state.is_tokensEnable_HUSD &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('HUSD') }}>
                          <img alt='' className="token-logo" src={this.state.token.HUSD} />
                          <span className="token-title">
                            HUSD
                          <i>(HUSD)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'HUSD' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'BUSD' && this.state.is_tokensEnable_BUSD &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('BUSD') }}>
                          <img alt='' className="token-logo" src={this.state.token.BUSD} />
                          <span className="token-title">
                            BUSD
                          <i>(Binance USD)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'BUSD' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'GOLDx' && this.state.is_tokensEnable_GOLDx &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('GOLDx') }}>
                          <img alt='' className="token-logo" src={this.state.token.GOLDx} />
                          <span className="token-title">
                            GOLDx
                          <i>(dForce)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'GOLDx' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        this.state.cur_recive_addr !== 'TUSD' && this.state.is_tokensEnable_TUSD &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('TUSD') }}>
                          <img alt='' className="token-logo" src={this.state.token.TUSD} />
                          <span className="token-title">
                            TUSD
                          <i>(TrueUSD)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'TUSD' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }
                      {
                        // this.state.cur_recive_addr !== 'imBTC' && this.state.is_tokensEnable_imBTC &&
                        // <div className="more-tokens-token" onClick={() => { this.change_send_addr('imBTC') }}>
                        //   <img alt='' className="token-logo" src={this.state.token.imBTC} />
                        //   <span className="token-title">
                        //     imBTC
                        //   <i>(The Tokenized Bitcoin)</i>
                        //   </span>
                        //   {
                        //     this.state.cur_send_addr === 'imBTC' &&
                        //     <img alt='' className="token-isselected" src={is_selected} />
                        //   }
                        // </div>
                      }
                      {
                        this.state.cur_recive_addr !== 'HBTC' && this.state.is_tokensEnable_HBTC &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('HBTC') }}>
                          <img alt='' className="token-logo" src={this.state.token.HBTC} />
                          <span className="token-title">
                            HBTC
                          <i>(Huobi BTC)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'HBTC' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }
                      {
                        this.state.cur_recive_addr !== 'WBTC' && this.state.is_tokensEnable_WBTC &&
                        <div className="more-tokens-token" onClick={() => { this.change_send_addr('WBTC') }}>
                          <img alt='' className="token-logo" src={this.state.token.WBTC} />
                          <span className="token-title">
                            WBTC
                          <i>(Wrapped BTC)</i>
                          </span>
                          {
                            this.state.cur_send_addr === 'WBTC' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                    </div>
                  }
                </button>
              </div>

              <div className="other-tokens-right">
                <input
                  value={this.state.side_A_amount || ''}
                  onChange={(e) => handle_A_change(e.target.value, this)}
                  placeholder={this.state.cur_language === '中文' ? '输入数量' : 'Amount'}
                />
                <span
                  onClick={() => handle_A_max(this)}
                  className="other-tokens-right-max"
                >
                  MAX
                </span>
              </div>

              <div className="other-tokens-rate">
                1 {this.state.cur_send_addr} = {' '}
                {
                  this.state.cur_exchange ?
                    format_bn((this.bn(this.state.cur_exchange).div(this.bn(10 ** 10))).toString(), 8, 8)
                    : '···'
                }
                {' ' + this.state.cur_recive_addr}
                {/* {' (inclusive of fees)'} */}
              </div>
              <div className="other-tokens-rate-p">
                {'Fee: 0.00%'}
              </div>
            </div>

            <div className="exchange">
              <img alt='' className='exc' src={exchange} onClick={() => { this.change_send_to_recive() }} />
              <img alt='' className='exc_mob' src={exchange_mob} onClick={() => { this.change_send_to_recive() }} />

              {
                this.state.is_Insufficient_Balance &&
                <div className='show-tips'>
                  <img alt='' className='show-tips-img' src={show_tips} />
                  <span className='show-tips-text'>
                    <FormattedMessage id='Insufficient_Balance' />
                  </span>
                </div>
              }
              {
                this.state.is_liquidity_limit &&
                <div className='show-tips'>
                  <img alt='' className='show-tips-img' src={show_tips} />
                  <span className='show-tips-text'>
                    <FormattedMessage id='Insufficient_Liquidity' />
                  </span>
                </div>
              }
              {
                // this.state.is_no_supported &&
                // <div className='show-tips'>
                //   <img alt='' className='show-tips-img' src={show_tips} />
                //   <span className='show-tips-text'>
                //     <FormattedMessage id='No_SUPPORTED' />
                //   </span>
                // </div>
              }
            </div>

            {/* right */}
            <div className="other-tokens float-right">
              <div className="token-balance-left">
                <FormattedMessage id='recive' />
                {
                  this.state.cur_recive_addr === 'USDx' &&
                  <span className="my-balance">
                    {this.state.my_balance_USDx ? format_num_to_K(format_bn(this.state.my_balance_USDx, this.state.decimals.USDx, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'USDT' &&
                  <span className="my-balance">
                    {this.state.my_balance_USDT ? format_num_to_K(format_bn(this.state.my_balance_USDT, this.state.decimals.USDT, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'USDC' &&
                  <span className="my-balance">
                    {this.state.my_balance_USDC ? format_num_to_K(format_bn(this.state.my_balance_USDC, this.state.decimals.USDC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'PAX' &&
                  <span className="my-balance">
                    {this.state.my_balance_PAX ? format_num_to_K(format_bn(this.state.my_balance_PAX, this.state.decimals.PAX, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'TUSD' &&
                  <span className="my-balance">
                    {this.state.my_balance_TUSD ? format_num_to_K(format_bn(this.state.my_balance_TUSD, this.state.decimals.TUSD, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'DAI' &&
                  <span className="my-balance">
                    {this.state.my_balance_DAI ? format_num_to_K(format_bn(this.state.my_balance_DAI, this.state.decimals.DAI, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'imBTC' &&
                  <span className="my-balance">
                    {this.state.my_balance_imBTC ? format_num_to_K(format_bn(this.state.my_balance_imBTC, this.state.decimals.imBTC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'HBTC' &&
                  <span className="my-balance">
                    {this.state.my_balance_HBTC ? format_num_to_K(format_bn(this.state.my_balance_HBTC, this.state.decimals.HBTC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'WBTC' &&
                  <span className="my-balance">
                    {this.state.my_balance_WBTC ? format_num_to_K(format_bn(this.state.my_balance_WBTC, this.state.decimals.WBTC, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'HUSD' &&
                  <span className="my-balance">
                    {this.state.my_balance_HUSD ? format_num_to_K(format_bn(this.state.my_balance_HUSD, this.state.decimals.HUSD, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'BUSD' &&
                  <span className="my-balance">
                    {this.state.my_balance_BUSD ? format_num_to_K(format_bn(this.state.my_balance_BUSD, this.state.decimals.BUSD, 2)) : '···'}
                  </span>
                }
                {
                  this.state.cur_recive_addr === 'GOLDx' &&
                  <span className="my-balance">
                    {this.state.my_balance_GOLDx ? format_num_to_K(format_bn(this.state.my_balance_GOLDx, this.state.decimals.GOLDx, 2)) : '···'}
                  </span>
                }
                <span className="my-balance-title">
                  <FormattedMessage id='balance' />:
              </span>
              </div>

              <div className="other-tokens-left">
                <button
                  onClick={() => { this.setState({ show_right_more_token: !this.state.show_right_more_token }) }}
                  onBlur={() => { this.change_recive_addr('kong') }}
                >
                  <img alt='' className="token-logo" src={this.state.token[this.state.cur_recive_addr]} />
                  <span className="token-title">
                    {this.state.cur_recive_addr}
                  </span>
                  <span className={this.state.show_right_more_token ? "token-tips-re" : "token-tips"}></span>

                  {
                    this.state.show_right_more_token &&
                    <div className="more-tokens">

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'USDT') && this.state.is_tokensEnable_USDT &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('USDT') }}>
                          <img alt='' className="token-logo" src={this.state.token.USDT} />
                          <span className="token-title">
                            USDT
                          <i>(Tether USD)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'USDT' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'USDx') && this.state.is_tokensEnable_USDx &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('USDx') }}>
                          <img alt='' className="token-logo" src={this.state.token.USDx} />
                          <span className="token-title">
                            USDx
                          <i>(dForce)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'USDx' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'USDC') && this.state.is_tokensEnable_USDC &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('USDC') }}>
                          <img alt='' className="token-logo" src={this.state.token.USDC} />
                          <span className="token-title">
                            USDC
                          <i>(USD//C)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'USDC' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'DAI') && this.state.is_tokensEnable_DAI &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('DAI') }}>
                          <img alt='' className="token-logo" src={this.state.token.DAI} />
                          <span className="token-title">
                            DAI
                          <i>(Dai Stablecoin)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'DAI' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'PAX') && this.state.is_tokensEnable_PAX &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('PAX') }}>
                          <img alt='' className="token-logo" src={this.state.token.PAX} />
                          <span className="token-title">
                            PAX
                          <i>(Paxos Standard)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'PAX' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'HUSD') && this.state.is_tokensEnable_HUSD &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('HUSD') }}>
                          <img alt='' className="token-logo" src={this.state.token.HUSD} />
                          <span className="token-title">
                            HUSD
                          <i>(HUSD)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'HUSD' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'BUSD') && this.state.is_tokensEnable_BUSD &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('BUSD') }}>
                          <img alt='' className="token-logo" src={this.state.token.BUSD} />
                          <span className="token-title">
                            BUSD
                          <i>(Binance USD)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'BUSD' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'GOLDx') && this.state.is_tokensEnable_GOLDx &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('GOLDx') }}>
                          <img alt='' className="token-logo" src={this.state.token.GOLDx} />
                          <span className="token-title">
                            GOLDx
                          <i>(dForce)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'GOLDx' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }

                      {
                        (this.state.is_stable_coin_send && this.state.cur_send_addr !== 'TUSD') && this.state.is_tokensEnable_TUSD &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('TUSD') }}>
                          <img alt='' className="token-logo" src={this.state.token.TUSD} />
                          <span className="token-title">
                            TUSD
                          <i>(TrueUSD)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'TUSD' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }
                      {
                        // (!this.state.is_stable_coin_send && this.state.cur_send_addr !== 'imBTC') && this.state.is_tokensEnable_imBTC &&
                        // <div className="more-tokens-token" onClick={() => { this.change_recive_addr('imBTC') }}>
                        //   <img alt='' className="token-logo" src={this.state.token.imBTC} />
                        //   <span className="token-title">
                        //     imBTC
                        //   <i>(The Tokenized Bitcoin)</i>
                        //   </span>
                        //   {
                        //     this.state.cur_recive_addr === 'imBTC' &&
                        //     <img alt='' className="token-isselected" src={is_selected} />
                        //   }
                        // </div>
                      }
                      {
                        (!this.state.is_stable_coin_send && this.state.cur_send_addr !== 'HBTC') && this.state.is_tokensEnable_HBTC &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('HBTC') }}>
                          <img alt='' className="token-logo" src={this.state.token.HBTC} />
                          <span className="token-title">
                            HBTC
                          <i>(Huobi BTC)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'HBTC' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }
                      {
                        (!this.state.is_stable_coin_send && this.state.cur_send_addr !== 'WBTC') && this.state.is_tokensEnable_WBTC &&
                        <div className="more-tokens-token" onClick={() => { this.change_recive_addr('WBTC') }}>
                          <img alt='' className="token-logo" src={this.state.token.WBTC} />
                          <span className="token-title">
                            WBTC
                          <i>(Wrapped BTC)</i>
                          </span>
                          {
                            this.state.cur_recive_addr === 'WBTC' &&
                            <img alt='' className="token-isselected" src={is_selected} />
                          }
                        </div>
                      }
                    </div>
                  }
                </button>
              </div>
              <div className="other-tokens-right">
                <input
                  value={this.state.side_B_amount || ''}
                  placeholder={this.state.cur_language === '中文' ? '输入数量' : 'Amount'}
                  onChange={(e) => handle_B_change(e.target.value, this)}
                />
              </div>

              <div className="other-tokens-rate text-right">
                {
                  this.state.is_liquidity_limit &&
                  <div className='Liquidity-tips'>
                    <span className='Liquidity-tit'>
                      MAX Liquidity:
                  </span>
                    <span className='Liquidity-num' onClick={() => handle_B_max(this)}>
                      {
                        format_num_to_K(format_bn((this.bn(this.state.cur_liquidaty)).toString(), this.state.cur_recive_decimals, 2))
                        // '12345'
                      }
                    </span>
                  </div>
                }
              </div>
            </div>

          </div>
          <div className='clear'></div>

          <div
            onClick={() => { this.before_swap_click() }}
            className={this.state.is_wap_enable && !this.state.is_no_supported ? "btn-wrap" : "btn-wrap-disable"}
          >
            {
              this.state.is_no_supported ?
                <FormattedMessage id='Not_SUPPORTED' />
                :
                <FormattedMessage id='swap' />
            }
          </div>

          <History
            account={this.state.my_account}
            net_type={this.state.net_type}
            new_web3={this.new_web3}
            load_new_history={this.state.load_new_history}
            cur_language={this.state.cur_language}
          />


          {/* foot */}
          <div className="foot">
            <div className="foot-item">
              <div className="foot-item-title">
                <FormattedMessage id='Resource' />
              </div>
              <div className="foot-item-content">
                <a href='https://github.com/dforce-network/xswap.git' target='_blank' rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
              <div className="foot-item-content">
                <a
                  href={
                    this.state.cur_language === '中文' ?
                      'https://docn.dforce.network/dforce-trade'
                      :
                      'https://docs.dforce.network/dforce-trading-protocol/dforce-trade'
                  }
                  target='_blank'
                  rel="noopener noreferrer"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div className="foot-item">
              <div className="foot-item-title">
                <FormattedMessage id='Community' />
              </div>
              <div className="foot-item-content icom-a">
                <a href='https://twitter.com/dForcenet' target='_blank' rel="noopener noreferrer">
                  <img alt='' src={Twitter} />
                </a>
                <a href='https://t.me/dforcenet' target='_blank' rel="noopener noreferrer">
                  <img alt='' src={Telegram} />
                </a>
                <a href='https://medium.com/dforcenet' target='_blank' rel="noopener noreferrer">
                  <img alt='' src={Medium} />
                </a>
                <a href='https://www.reddit.com/r/dForceNetwork' target='_blank' rel="noopener noreferrer">
                  <img alt='' src={Reddit} />
                </a>
                <a href='https://discord.gg/Gbtd3MR' target='_blank' rel="noopener noreferrer">
                  <img alt='' src={Discord} />
                </a>
                <a href='https://www.linkedin.com/company/dforce-network' target='_blank' rel="noopener noreferrer">
                  <img alt='' src={LinkedIn} />
                </a>
                <a href='https://www.youtube.com/channel/UCM6Vgoc-BhFGG11ZndUr6Ow' target='_blank' rel="noopener noreferrer">
                  <img alt='' src={Youtube} />
                </a>
                {
                  this.state.cur_language === '中文' &&
                  <span className='weixin-img-wrap'>
                    <img alt='' src={weixin} />
                    <img alt='' className='weixin-img' src={erweima} />
                  </span>
                }
              </div>

              <div className='footer-right-fixed'>
                <div className='fixed1'>
                  {
                    this.state.cur_language === '中文' ? '中文简体' : 'English'
                  }
                </div>
                <span className='fixed-img'>
                  <img alt='' src={arrow_u} />
                </span>
                <div className='fixed2'>
                  <ul>
                    <li onClick={() => { this.setState({ cur_language: '中文' }) }}>{'中文简体'}</li>
                    <li onClick={() => { this.setState({ cur_language: 'English' }) }}>{'English'}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="foot-item padding-left20">
              <div className="foot-item-title">
                <FormattedMessage id='Contract_US' />
              </div>
              <div className="foot-item-content">
                support@dforce.network
              </div>
              <div className="foot-item-content">
                bd@dforce.network
              </div>
              <div className="foot-item-content">
                tech@dforce.network
              </div>
            </div>
            <div className="clear"></div>
          </div>


        </div>
      </IntlProvider >
    )
  }
}
