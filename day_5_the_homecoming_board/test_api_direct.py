#!/usr/bin/env python3
"""
Test the aviation stack API directly to verify it works
"""

import requests
import json

def test_airports_api():
    print("🏢 Testing Airports API...")
    
    url = "https://api.aviationstack.com/v1/airports"
    params = {
        'access_key': '',
        'limit': 10
    }
    
    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if 'data' in data and len(data['data']) > 0:
                print(f"✅ Success! Retrieved {len(data['data'])} airports")
                
                # Show first few airports
                for i, airport in enumerate(data['data'][:3]):
                    print(f"  {i+1}. {airport.get('iata_code', 'N/A')} - {airport.get('airport_name', 'Unknown')}")
                    print(f"     {airport.get('city_name', 'Unknown')}, {airport.get('country_name', 'Unknown')}")
                
                return True
            else:
                print("❌ No airport data in response")
                print("Response:", data)
                return False
        else:
            print(f"❌ API request failed with status {response.status_code}")
            print("Response:", response.text)
            return False
            
    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        return False

def test_timetable_api():
    print("\n✈️ Testing Timetable API...")
    
    # Test with JFK airport
    url = "https://api.aviationstack.com/v1/timetable"
    params = {
        'access_key': '',
        'iataCode': 'JFK',
        'type': 'departure',
        'limit': 5
    }
    
    try:
        response = requests.get(url, params=params)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if 'data' in data and len(data['data']) > 0:
                print(f"✅ Success! Retrieved {len(data['data'])} flights")
                
                # Show first few flights
                for i, flight in enumerate(data['data'][:2]):
                    flight_num = flight.get('flight_iata', flight.get('flight_icao', 'Unknown'))
                    airline = flight.get('airline', {}).get('name', 'Unknown Airline')
                    print(f"  {i+1}. {flight_num} - {airline}")
                    
                    dep = flight.get('departure', {})
                    arr = flight.get('arrival', {})
                    print(f"     {dep.get('iata', 'N/A')} ➜ {arr.get('iata', 'N/A')}")
                
                return True
            else:
                print("❌ No flight data in response")
                print("Response:", data)
                return False
        else:
            print(f"❌ API request failed with status {response.status_code}")
            print("Response:", response.text)
            return False
            
    except Exception as e:
        print(f"❌ Exception occurred: {e}")
        return False

def main():
    print("🚀 Testing Aviation Stack API Integration\n")
    
    airports_success = test_airports_api()
    timetable_success = test_timetable_api()
    
    print("\n📊 Test Summary:")
    print(f"Airports API: {'✅ PASS' if airports_success else '❌ FAIL'}")
    print(f"Timetable API: {'✅ PASS' if timetable_success else '❌ FAIL'}")
    
    if airports_success and timetable_success:
        print("\n🎉 All API tests passed! The aviation stack integration is working correctly.")
        print("\nNext steps:")
        print("1. ✅ Airport list should populate properly")
        print("2. ✅ Arrivals/departures should load with real data")
        print("3. ✅ Scrolling should work for long lists")
        print("4. ✅ Gesture navigation should work smoothly")
    else:
        print("\n⚠️ Some API tests failed. The app will use mock data for demonstration.")

if __name__ == "__main__":
    main()
