package acinfo

import (
	"errors"
	//"fmt"
	//"golang.org/x/net/html"
	"HangarHero/models"
	//"net/http"
	//"strings"
)

func USAircraftSearch(regNumber string) (models.AircraftReport, error) {
	//	faa := "http://registry.faa.gov/aircraftinquiry/NNum_Results.aspx?NNumbertxt="

	//	faa += regNumber
	//	resp, err := http.Get(faa)
	//	if err != nil {
	//		fmt.Println("ERROR: Failed to crawl \"" + faa + "\"")
	//		emptyReport := models.AircraftReport{}
	//		return emptyReport, errors.New("unable to connect to faa")
	//	}
	//	b := resp.Body
	//	defer b.Close() // close Body when the function returns

	//	z := html.NewTokenizer(b)
	//	rawData := []string{}
	//L:
	//	for {
	//		tt := z.Next()

	//		switch {
	//		case tt == html.ErrorToken:
	//			// End of the document, we're done
	//			break L
	//		case tt == html.TextToken:
	//			t := z.Token()
	//			t.Data = strings.TrimSpace(t.Data)
	//			if t.Data != "" {
	//				rawData = append(rawData, t.Data)
	//			}

	//		}
	//	}
	//	if len(rawData) > 108 {
	//		aircraftData := models.AircraftReport{0, regNumber, rawData[51], rawData[53], rawData[55],
	//			rawData[57], rawData[59], rawData[61], rawData[63], rawData[65], rawData[84],
	//			rawData[86], rawData[88], rawData[90], rawData[92], rawData[94], rawData[96],
	//			rawData[99], rawData[101], rawData[103], rawData[105], rawData[107], nil}

	//		return aircraftData, nil
	//	}
	emptyReport := models.AircraftReport{}
	return emptyReport, errors.New("bad faa data")
}
