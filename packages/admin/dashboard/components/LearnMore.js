/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import LearnMoreDetails from '../LearnMoreDetails';

import {
    ScCard, 
    ScDashboardModule, 
    ScStackedList, 
    ScStackedListRow,
    ScIcon,
    ScFlex,
} from '@surecart/components-react';

export default () => {
    return (
        <ScDashboardModule 
            css={css`
                width: 33%;
                @media screen and (max-width: 782px) {
                    width: 100%;
                }
                .sc-learn-details{
                    width: 75%;
                }
                .sc-learn-details-title {
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 28px;
                    color: #334155; 
                    margin: 0.4em 0;  
                }
                .sc-learn-details-desc {
                    font-weight: 400;
                    font-size: 16px;
                    line-height: 28px;
                    color: #334155; 
                    margin: 0.4em 0;  
                }
                .sc-learn-more-title {
                    line-height: 32px;
                }
            `}
        >
            <span className='sc-learn-more-title' slot="heading">{__('Learn More', 'surecart')}</span>
            <ScCard noPadding>
                <ScStackedList>
                    <ScStackedListRow href="#" style={{ '--columns': '2', '--sc-list-row-background-color': 'transparent' }}>
                        <ScFlex justifyContent="center" alignItems="center">
                            <ScIcon name="film" style={{fontSize: "60px", 'margin-right':'15px', color: "#08BA4F"}} />
                            <LearnMoreDetails
                                title={__('Tutorial Videos', 'surecart')} 
                                descriptions={__('Learn more about SureCart', 'surecart')} 
                            />  
                            <ScIcon name="chevron-right" style={{fontSize: "20px", color: "#334155"}} />
                        </ScFlex>
                    </ScStackedListRow>
                    <ScStackedListRow href="#" style={{ '--columns': '2', '--sc-list-row-background-color': 'transparent' }}>
                        <ScFlex justifyContent="center" alignItems="center">
                            <ScIcon name="users" style={{fontSize: "60px", 'margin-right':'15px', color: "#08BA4F"}} />
                            <LearnMoreDetails
                                title={__('Join Our Community', 'surecart')} 
                                descriptions={__('Connect with others in on Facebook', 'surecart')} 
                            />  
                            <ScIcon name="chevron-right" style={{fontSize: "20px", color: "#334155"}} />
                        </ScFlex>
                    </ScStackedListRow>
                    <ScStackedListRow href="#" style={{ '--columns': '2', '--sc-list-row-background-color': 'transparent' }}>
                        <ScFlex justifyContent="center" alignItems="center">
                            <ScIcon name="life-buoy" style={{fontSize: "60px", 'margin-right':'15px', color: "#08BA4F"}} />
                            <LearnMoreDetails
                                title={__('Get Help', 'surecart')} 
                                descriptions={__('Contact our support for additional help', 'surecart')} 
                            />  
                            <ScIcon name="chevron-right" style={{fontSize: "20px", color: "#334155"}} />
                        </ScFlex>
                    </ScStackedListRow>
                </ScStackedList>
            </ScCard>
        </ScDashboardModule>
    );
};
