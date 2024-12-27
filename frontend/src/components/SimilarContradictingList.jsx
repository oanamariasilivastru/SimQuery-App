// src/components/SimilarContradictingList.jsx

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Highlighter from 'react-highlight-words';
import { FaStar } from 'react-icons/fa';  // pentru stele
import '../theme/SimilarContradictingList.css';

/**
 * Component for expandable text (See More / See Less).
 * If text is shorter than `maxLength`, it shows it fully.
 * If it's longer, it displays up to `maxLength` characters,
 * plus a toggle button.
 */
function ExpandableText({ text, searchWords, maxLength = 300 }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  if (text.length <= maxLength) {
    // Text scurt => afișăm tot, fără buton
    return (
      <Highlighter
        highlightClassName="highlight"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={text}
      />
    );
  }

  // Text lung => afișăm doar primele `maxLength` caractere
  const textToShow = expanded ? text : text.slice(0, maxLength) + '...';

  return (
    <div className="expandable-text">
      <Highlighter
        highlightClassName="highlight"
        searchWords={searchWords}
        autoEscape={true}
        textToHighlight={textToShow}
      />
      <button className="see-more-button" onClick={() => setExpanded(!expanded)}>
        {expanded ? 'See Less' : 'See More'}
      </button>
    </div>
  );
}

ExpandableText.propTypes = {
  text: PropTypes.string.isRequired,
  searchWords: PropTypes.arrayOf(PropTypes.string).isRequired,
  maxLength: PropTypes.number,
};

const SimilarContradictingList = ({ results }) => {
  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  // Date pentru 3 scenarii
  const data = {
    hurricaneIan: {
      prompt: 'Hurricane Ian Strikes Florida',
      searchWords: ['hurricane', 'ian', 'florida', 'evacuation', 'damage'],

      // 5 articole similare, cu sursă și scor
      similarArticles: [
        {
          source: 'The Florida Herald',
          score: 4.7,
          text: `As Hurricane Ian made landfall on Florida’s Gulf Coast, the region experienced catastrophic flooding alongside winds reaching over 150 mph. State officials declared a mandatory evacuation in low-lying areas, urging residents to find safe shelter. Emergency services were stretched thin as rescue operations commenced, with numerous reports of stranded individuals seeking assistance. The local infrastructure suffered severe damage, including collapsed bridges and destroyed homes. Recovery efforts are expected to take months, if not years, as the community rallies together to rebuild and recover from the devastation caused by the hurricane. In the aftermath, discussions have arisen regarding improved building codes and better preparedness for future storms. Local businesses have been hit hard, with many facing prolonged closures due to damage and supply chain disruptions. Volunteer organizations have mobilized to provide food, water, and medical supplies to affected areas, highlighting the resilience and solidarity of the Florida community in the face of natural disasters. Additionally, there is a growing conversation about the role of climate change in exacerbating the intensity of such hurricanes, prompting policymakers to consider more sustainable and proactive measures to mitigate future risks.`,
        },
        {
          source: 'Miami Daily News',
          score: 4.5,
          text: `Local volunteers teamed up with the National Guard to distribute supplies and provide immediate relief to those who lost electricity, clean water, and basic necessities. While power companies struggled to restore service to millions of customers, community centers were transformed into makeshift shelters, offering refuge and support to displaced families. Hospitals operated under emergency protocols to handle an influx of patients with injuries and stress-related conditions. The Miami Daily News also reported on the significant impact on tourism, a major economic driver in the region, with hotels and attractions facing unprecedented cancellations and revenue losses. Environmental concerns have been raised regarding the disposal of debris and the restoration of natural habitats affected by the hurricane’s wrath. Long-term plans include enhancing flood defenses and investing in more resilient infrastructure to better withstand future hurricanes. The collaboration between government agencies, non-profits, and local businesses underscores the comprehensive approach needed to address the multifaceted challenges posed by such natural disasters.`,
        },
        {
          source: 'Sunshine Observer',
          score: 4.3,
          text: `According to preliminary forecasts, the economic toll could climb into tens of billions of dollars, surpassing initial predictions. Infrastructure such as bridges, highways, and power grids took a severe hit, disrupting daily life and hindering recovery efforts. The Sunshine Observer delves into the specifics of the damage, highlighting the destruction of critical transportation links that have isolated certain communities. Efforts to rebuild are hampered by supply shortages and logistical challenges, with construction materials in high demand and limited availability. The article also explores the psychological impact on residents, many of whom are grappling with trauma and loss, and the importance of mental health support in the recovery process. Additionally, there is a focus on the environmental repercussions, including the contamination of waterways and the loss of green spaces, necessitating comprehensive environmental remediation initiatives.`,
        },
        {
          source: 'Gulf Coast Times',
          score: 4.2,
          text: `Even as the winds subsided, the aftermath revealed widespread devastation. Residents reported that certain neighborhoods looked almost unrecognizable, with streets clogged by debris, uprooted trees, and abandoned vehicles. The Gulf Coast Times provides a detailed account of the challenges faced by local authorities in clearing roads and restoring essential services. Community-driven clean-up efforts have been crucial, with neighbors helping neighbors to salvage what they can and rebuild their lives. The article also touches upon the strain on local resources, including limited access to clean water and medical supplies, and the role of neighboring states in providing assistance. Long-term recovery plans are being formulated, focusing on sustainable rebuilding practices that incorporate lessons learned from Hurricane Ian. The resilience of the Gulf Coast community shines through as they navigate the complexities of rebuilding in the wake of such a powerful storm.`,
        },
        {
          source: 'National Weather Journal',
          score: 4.0,
          text: `Long-term effects could be felt for months or even years, as communities slowly rebuild schools, businesses, and residential districts. Environmental scientists also worry about saltwater intrusion into freshwater systems, which could have lasting impacts on agriculture and drinking water supplies. The National Weather Journal discusses the broader climatic patterns that may have influenced Hurricane Ian's intensity and trajectory, examining data on ocean temperatures and atmospheric conditions. The article emphasizes the need for improved predictive models to better anticipate such powerful storms and implement timely evacuation and response strategies. Additionally, it explores the potential for technological advancements in disaster management, including the use of drones for damage assessment and the implementation of smart infrastructure designed to withstand extreme weather events. Collaborative efforts between meteorologists, urban planners, and policymakers are highlighted as essential components in mitigating the effects of future hurricanes.`,
        },
      ],

      // 3 articole contradictorii, cu sursă, dar fără scor
      contradictingArticles: [
        {
          source: 'Coastal Beacon',
          text: `Contrary to widespread reports of devastation, a few local commentators argued that certain inland regions of Florida were largely unaffected, experiencing only moderate rain and brief power outages. They claimed the media overhyped the situation to attract more viewers and advertisers, suggesting that the true impact of Hurricane Ian has been exaggerated. These commentators pointed to specific areas where infrastructure remained intact and there were minimal disruptions to daily life, emphasizing the resilience of these communities. They also criticized the emergency response, stating that resources were disproportionately allocated to certain regions while neglecting others that did not require extensive aid. Furthermore, they questioned the long-term economic projections, arguing that the tourism sector would rebound quickly without sustained government intervention. This perspective has sparked debates among residents and officials about the accuracy of disaster reporting and the effectiveness of the response strategies implemented during the hurricane.`,
        },
        {
          source: 'SocialBuzz TV',
          text: `A handful of social media influencers posted videos showing normal daily life in some neighborhoods, suggesting that evacuation orders might have been excessive. These influencers showcased local cafes, schools, and parks operating as usual, challenging the narrative of widespread chaos and destruction. They argued that the overemphasis on evacuation created unnecessary panic among residents, leading to economic losses for small businesses and disrupting the community fabric. Local authorities responded by highlighting areas that did require evacuation and the reasons behind those decisions, emphasizing the unpredictable nature of hurricanes and the need for caution. The debate has raised questions about the balance between ensuring public safety and maintaining community stability during natural disasters. Additionally, it has highlighted the role of social media in shaping public perception and the challenges authorities face in managing information dissemination during crises.`,
        },
        {
          source: 'Economic Insider',
          text: `Some economists insisted that the overall economic hit would be minimal because of Florida’s robust tourism sector. They believe that the state’s disaster-response infrastructure would expedite repairs and restore normal activity within weeks, mitigating long-term financial impacts. Economic Insider analysts pointed out that historical data shows rapid recovery in tourism-driven economies following natural disasters, citing previous hurricanes that had temporarily disrupted but ultimately reinforced the sector’s resilience. They also highlighted investments in infrastructure and emergency preparedness that reduce downtime and facilitate swift recovery. Furthermore, they argued that insurance payouts and federal aid would buffer the financial strain on businesses and individuals, preventing widespread economic downturns. This optimistic outlook contrasts with more cautious assessments, offering a balanced perspective on the potential economic ramifications of Hurricane Ian.`,
        },
      ],
    },

    volcanoIceland: {
      prompt: 'Volcanic Eruption in Iceland’s Reykjanes Peninsula',
      searchWords: ['volcano', 'iceland', 'eruption', 'lava', 'peninsula'],

      similarArticles: [
        {
          source: 'Reykjavik Post',
          score: 4.6,
          text: `A massive volcanic eruption began erupting along Iceland’s Reykjanes Peninsula, spewing large amounts of lava and ash into the atmosphere. Volcanologists had closely monitored seismic activity for months, and the eruption, while initially contained to a single fissure, quickly expanded in intensity and breadth. The Reykjavik Post provides an in-depth analysis of the geological factors that contributed to the eruption, including tectonic plate movements and magma chamber dynamics. The article also explores the immediate environmental impact, detailing the formation of new lava fields and the alteration of local landscapes. Efforts to monitor and mitigate air quality issues caused by ash clouds have been implemented, with health advisories issued to protect residents and wildlife. The eruption has attracted scientists and tourists alike, with controlled access granted for research and observation, highlighting the delicate balance between scientific inquiry and public safety.`,
        },
        {
          source: 'Nordic Press Agency',
          score: 4.5,
          text: `Emergency evacuation procedures were activated in nearby fishing villages, as molten lava advanced within a few kilometers of the coastline. Although the eruption was initially contained to a single fissure, the Nordic Press Agency reports that the rapid expansion of lava flows threatened critical infrastructure, including ports and residential areas. Local authorities coordinated with national disaster response teams to ensure the safety of residents, utilizing early warning systems and real-time monitoring to manage the evacuation process efficiently. The article details the logistical challenges faced during the evacuation, such as transportation bottlenecks and the need for temporary shelters. Additionally, it highlights the resilience and cooperation of the affected communities, with residents volunteering to assist in evacuation efforts and support their neighbors. The impact on the fishing industry, a vital component of the regional economy, is also examined, with projections indicating significant short-term disruptions but a swift recovery once the immediate threat subsides.`,
        },
        {
          source: 'Global Geology Weekly',
          score: 4.4,
          text: `News outlets highlighted the dramatic visuals: rivers of lava creeping through desolate fields and striking fiery contrast against Iceland’s snowy landscapes. Drone footage captured how the magma interacted with ice, leading to explosive steam eruptions and the formation of new volcanic formations. Global Geology Weekly provides a comprehensive overview of the eruption’s geological significance, discussing how the event offers valuable insights into volcanic behavior and magma dynamics. The article features interviews with leading volcanologists who explain the potential long-term implications for the Reykjanes Peninsula and surrounding regions. Additionally, it explores the technological advancements in volcanic monitoring that have enabled scientists to predict and respond to such eruptions more effectively. The interplay between natural beauty and destructive power is emphasized, showcasing the dual nature of volcanic activity as both a creative and devastating force of nature.`,
        },
        {
          source: 'Travel Iceland Magazine',
          score: 4.3,
          text: `Local businesses, particularly in tourism and lodging, quickly adapted, offering special tours to observe the eruptions from a safe distance. Some entrepreneurs saw an opportunity to capitalize on the influx of scientists, photographers, and adventure tourists eager to witness the natural spectacle. Travel Iceland Magazine discusses the economic impact of the eruption on the tourism sector, highlighting how guided tours, specialized accommodations, and transportation services have evolved to meet the demands of visitors. The article also addresses the environmental considerations of increased tourism in a fragile volcanic area, emphasizing sustainable practices to minimize human impact. Additionally, it features stories from tourists and business owners, capturing the unique experiences and challenges faced during this period of volcanic activity. The resilience and adaptability of the local economy are showcased as key factors in maintaining Iceland’s reputation as a premier destination for nature enthusiasts and adventurers.`,
        },
        {
          source: 'Icelandic Times',
          score: 4.1,
          text: `In a rare statement, Iceland’s government detailed a multi-phase plan to address potential long-term impacts, including lava diversion techniques and constant air-quality monitoring. The Icelandic Times elaborates on the strategic measures outlined by government officials to mitigate the effects of the eruption, focusing on engineering solutions to redirect lava flows away from populated areas and critical infrastructure. The article also highlights the investment in advanced air quality monitoring systems to track ash dispersion and protect public health. Long-term recovery plans include rebuilding efforts, environmental restoration, and economic support for affected industries. The government’s proactive approach aims to balance immediate response with sustainable long-term strategies, ensuring that the region can recover and thrive despite the ongoing volcanic activity. Additionally, the role of international collaboration in providing expertise and resources is discussed, underscoring the global significance of the eruption and the collective effort required to manage its consequences.`,
        },
      ],
      contradictingArticles: [
        {
          source: 'Peninsula Dispatch',
          text: `Some local observers challenged initial headlines claiming severe disruption. They noted that while dramatic, the eruption was largely confined to remote areas, posing minimal risk to major population centers. Peninsula Dispatch reporters visited several unaffected communities to gather firsthand accounts, which largely echoed the sentiment that daily life continued with little interruption. They pointed out that early evacuation protocols were highly effective, ensuring that residents remained safe without significant economic or social fallout. The article questions the extent of the reported environmental damage, suggesting that initial assessments may have overestimated the long-term impacts. Furthermore, it highlights instances of rapid infrastructure repair and the swift return to normalcy in key areas, arguing that the eruption, while visually striking, does not warrant the level of concern portrayed in mainstream media. This perspective invites a more nuanced discussion about the actual versus perceived impacts of volcanic eruptions on local communities.`,
        },
        {
          source: 'Fjords Critic',
          text: `A few government critics accused officials of overreacting, arguing that forced evacuations were expensive and largely unnecessary due to the slow-moving nature of the lava. Fjords Critic features interviews with local business owners and residents who felt that their communities were unfairly targeted for evacuation despite low immediate threats. They contend that the resources allocated for emergency response could have been better utilized elsewhere, advocating for a more measured approach based on actual risk assessments rather than precautionary measures. The article also explores the political implications of the government’s handling of the eruption, suggesting that certain decisions may have been influenced by public pressure and media coverage rather than scientific evidence. Additionally, it questions the transparency of the information provided to the public, calling for clearer communication and more involvement of local stakeholders in the decision-making process. This critique underscores the tension between ensuring public safety and maintaining economic stability during natural disasters.`,
        },
        {
          source: 'EcoWatch Europe',
          text: `Environmental skeptics downplayed the ecological damage, suggesting that volcanic landscapes recover quickly and that global media outlets had sensationalized minor lava flows. EcoWatch Europe emphasizes the natural resilience of volcanic ecosystems, citing historical eruptions that have led to the creation of fertile soils and new habitats. The article argues that the current eruption, while visually impactful, does not present a significant threat to the broader environment, as natural processes will facilitate rapid recovery and regeneration. It also critiques the media’s portrayal of the eruption, claiming that exaggerated narratives contribute to unnecessary fear and misunderstanding of volcanic activity. Furthermore, EcoWatch Europe highlights the scientific consensus that supports the view of volcanic activity as a natural and integral part of Earth's geological cycles, with minimal long-term negative effects. This perspective encourages a more balanced and informed discourse on the environmental implications of volcanic eruptions.`,
        },
      ],
    },

    earthquakeJapan: {
      prompt: 'Major Earthquake Rocks Tokyo Region - Magnitude 7.3',
      searchWords: ['earthquake', 'tokyo', 'magnitude', 'japan', 'tsunami'],

      similarArticles: [
        {
          source: 'Tokyo Daily',
          score: 4.7,
          text: `A powerful 7.3 magnitude earthquake struck just off the coast near Tokyo, Japan, sending high-rise buildings swaying and prompting immediate tsunami advisories. The Tokyo Daily provides a comprehensive report on the earthquake's immediate effects, including structural damage to skyscrapers and disruptions to the city’s extensive public transportation network. Emergency services were rapidly deployed to affected areas, with search and rescue operations commencing to locate and assist individuals trapped in collapsed structures. The article also covers the response from government officials, who reassured the public and outlined the steps being taken to address the aftermath. Additionally, it highlights the resilience of Tokyo’s infrastructure, which withstood the quake with minimal casualties, thanks to stringent building codes and advanced engineering practices. The report includes personal stories from residents who experienced the earthquake, capturing the human element of the disaster and the community’s swift mobilization in response to the crisis.`,
        },
        {
          source: 'Japan News Wire',
          score: 4.5,
          text: `Local media reported that grocery stores and gas stations experienced brief surges of panic buying. However, the national emergency broadcast system quickly provided reassurance, urging calm and preventing widespread shortages. Japan News Wire examines the behavioral responses of Tokyo residents, noting how the initial shock of the earthquake led to spontaneous acts of precautionary purchasing. The article analyzes the effectiveness of the emergency communication strategies employed, which played a crucial role in mitigating potential panic and ensuring the stability of essential services. It also explores the impact on local businesses, with some reporting temporary closures while assessing structural integrity. The resilience of supply chains and the prompt restoration of utilities are highlighted as key factors that minimized long-term disruptions. Furthermore, the article discusses the economic implications of the earthquake, including the costs associated with infrastructure repairs and the potential for increased investment in earthquake preparedness measures to prevent future incidents.`,
        },
        {
          source: 'Seismic Review Online',
          score: 4.4,
          text: `Seismologists, who had monitored an uptick in regional activity, suggested that aftershocks could continue for several days. Authorities set up temporary shelters to accommodate those displaced by the earthquake. Seismic Review Online delves into the scientific analysis of the earthquake, discussing the tectonic movements that led to the event and the potential for additional seismic activity in the coming days. The article features interviews with leading seismologists who explain the importance of continuous monitoring and the challenges in predicting aftershock patterns. It also covers the logistical efforts involved in setting up and managing temporary shelters, ensuring that displaced residents receive necessary support and resources. Additionally, the article highlights the collaboration between various governmental and non-governmental organizations in coordinating relief efforts, emphasizing the multifaceted approach required to address both immediate and ongoing needs following a major earthquake.`,
        },
        {
          source: 'Kyodo Analysis',
          score: 4.2,
          text: `As the dust settled, Tokyo Governor’s office released a statement praising the city’s earthquake-resistant infrastructure and well-drilled emergency services. Kyodo Analysis explores the effectiveness of Tokyo’s preparedness measures, highlighting how advanced engineering and rigorous training protocols contributed to minimizing casualties and structural damage. The article assesses the performance of various infrastructure elements, such as retrofitted buildings, automated shutdown systems, and resilient utilities, which collectively enhanced the city’s ability to withstand the earthquake. Additionally, it examines the role of public education and community drills in fostering a culture of preparedness among residents. The analysis also considers areas for improvement, suggesting enhancements in communication systems and resource allocation to further bolster emergency response capabilities. By evaluating the strengths and identifying potential weaknesses in Tokyo’s earthquake preparedness, Kyodo Analysis provides valuable insights into best practices for urban resilience in the face of natural disasters.`,
        },
        {
          source: 'Global Finance Journal',
          score: 4.1,
          text: `Economic analysts predicted a temporary dip in stock markets and minor disruptions to manufacturing, but expected a quick rebound due to Japan’s robust contingency planning. The Global Finance Journal assesses the immediate and short-term economic impacts of the earthquake, noting how financial markets reacted to the uncertainty and potential risks associated with the disaster. The article discusses the resilience of key economic sectors, including technology and automotive industries, which are pivotal to Japan’s economy. Analysts project that while there may be initial setbacks, the comprehensive contingency plans and swift government interventions will facilitate a rapid recovery. The piece also explores the potential for increased investments in disaster-proof infrastructure and technology, viewing the earthquake as an impetus for further strengthening Japan’s economic resilience. Additionally, it highlights the role of international investors and multinational corporations in stabilizing markets and supporting recovery efforts, underscoring the interconnectedness of global finance in the aftermath of significant natural events.`,
        },
      ],
      contradictingArticles: [
        {
          source: 'Urban Voices',
          text: `Various online posts suggested that the quake warnings were exaggerated, with some Tokyo residents sharing videos of normal life on social media. They insisted that the city was largely untouched and that the earthquake posed minimal threat to daily activities. Urban Voices compiled a series of social media reactions that downplayed the severity of the earthquake, highlighting instances where businesses remained open and public transportation resumed operations swiftly. These posts questioned the necessity of the extensive emergency measures implemented, arguing that they caused unnecessary inconvenience and economic loss. The article explores the disconnect between official reports and public perception, suggesting that real-time updates and transparency could help bridge this gap. It also examines the psychological aspects of disaster perception, where firsthand experiences and selective reporting can influence how events are interpreted by the broader population.`,
        },
        {
          source: 'TrainLine Critics',
          text: `A number of commentators criticized the government’s decision to shut down train lines, arguing that the inconvenience and economic losses would far outweigh any real safety benefit. TrainLine Critics features opinions from commuters and business owners who experienced significant disruptions due to the temporary closure of major rail networks. They contend that the proactive shutdown was an overreaction, as structural assessments indicated that most trains and tracks remained operational. The article highlights the economic impact of halted transportation, including delays in goods delivery and reduced workforce mobility, which could hinder recovery efforts. It also questions the cost-effectiveness of the decision, suggesting that alternative measures, such as partial shutdowns or selective inspections, could have mitigated risks without causing widespread disruption. This critique underscores the importance of balancing safety protocols with economic considerations during disaster response planning.`,
        },
        {
          source: 'Local Biz Watch',
          text: `Some local business owners reported minimal impact and accused international media of sensationalism, claiming that the quake was not significantly different from frequent smaller tremors in the region. Local Biz Watch interviews several entrepreneurs who operate in high-rise buildings and industrial zones, noting that their operations continued with only minor interruptions. They argue that the media’s focus on potential disasters overlooks the effective measures already in place that prevent major disruptions. The article discusses the economic resilience of Tokyo’s business community, highlighting how established contingency plans and infrastructure robustness contribute to sustained operations even during seismic events. Additionally, it addresses the psychological impact of media reporting, suggesting that sensationalism can create unwarranted fear and uncertainty among the public and business stakeholders. By providing a platform for local business perspectives, the article offers a more nuanced view of the earthquake’s actual impact on commerce and industry.`,
        },
      ],
    },
  };

  // Selecție pe baza keys-urilor din `results`
  const selectedDatas = results.map((key) => data[key]).filter(Boolean);

  // Dacă nu e niciun scenariu valid
  if (selectedDatas.length === 0) {
    return <p>No valid results found.</p>;
  }

  return (
    <div className="similar-contradicting-list">
      {selectedDatas.map((scenario, idx) => (
        <div key={idx} className="scenario-section">
          {/* Prompt-ul (titlul) */}
          <h2 className="prompt-title">{scenario.prompt}</h2>

          <div className="columns-container">
            {/* 5 articole similare */}
            <div className="column similar-column">
              <h3>5 Most Similar Articles</h3>
              {scenario.similarArticles.slice(0, 5).map((article, i) => (
                <div key={i} className="article-item similar-article">
                  <p>
                    <strong>{article.source}</strong>
                  </p>
                  <ExpandableText
                    text={article.text}
                    searchWords={scenario.searchWords}
                    maxLength={400}
                  />
                  {/* Afișăm stele doar la cele similare */}
                  <div className="score-section">
                    {[...Array(Math.round(article.score))].map((_, k) => (
                      <FaStar key={k} color="gold" />
                    ))}
                    <span className="score-text"> {article.score}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 3 articole contradictorii */}
            <div className="column contradicting-column">
              <h3>3 Contradicting Articles</h3>
              {scenario.contradictingArticles.slice(0, 3).map((article, j) => (
                <div key={j} className="article-item contradicting-article">
                  <p>
                    <strong>{article.source}</strong>
                  </p>
                  <ExpandableText
                    text={article.text}
                    searchWords={scenario.searchWords}
                    maxLength={400}
                  />
                  {/* Fără stele la contradictorii */}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

SimilarContradictingList.propTypes = {
  // E.g. ['hurricaneIan', 'volcanoIceland', 'earthquakeJapan']
  results: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SimilarContradictingList;
