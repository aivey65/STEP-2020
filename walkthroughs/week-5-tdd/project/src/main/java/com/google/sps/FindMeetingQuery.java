// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Collection;
import java.util.Collections;


public final class FindMeetingQuery {
    public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {
        if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
            return Collections.emptyList();
        }

        List<TimeRange> conflictTimes = new ArrayList<TimeRange>();
        List<TimeRange> conflictTimesIncludingOptional = new ArrayList<TimeRange>();

        for (Event event : events) {
            if (!Collections.disjoint(request.getAttendees(), event.getAttendees())) {
                conflictTimes.add(event.getWhen());
                conflictTimesIncludingOptional.add(event.getWhen());
            }

            if (!Collections.disjoint(request.getOptionalAttendees(), event.getAttendees())) {
                conflictTimesIncludingOptional.add(event.getWhen());
            }
        }

        Collections.sort(conflictTimes, TimeRange.ORDER_BY_START);
        Collections.sort(conflictTimesIncludingOptional, TimeRange.ORDER_BY_START);

        List<TimeRange> meetingTimes = findAvailableTimes(conflictTimesIncludingOptional, request.getDuration());
        if (meetingTimes.isEmpty()) {
            if (!request.getAttendees().isEmpty() || request.getOptionalAttendees().isEmpty()) {
                meetingTimes = findAvailableTimes(conflictTimes, request.getDuration());
            }
        }
        return meetingTimes;
    }

    /**
     * Returns list of eligable time slots in a day given a list of conflicts.
     */
    public static List<TimeRange> findAvailableTimes(Collection<TimeRange> conflictTimes, long duration) {
        List<TimeRange> meetingTimes = new ArrayList<TimeRange>();
        int start = TimeRange.START_OF_DAY;

        for (TimeRange conflict : conflictTimes) {
            if (conflict.end() < start) {
                continue;
            }

            if (!conflict.contains(start)) {
                TimeRange possibleTime = TimeRange.fromStartEnd(start, conflict.start(), false);
                
                if (possibleTime.duration() >= duration) {
                    meetingTimes.add(possibleTime);
                    
                }
            }
            start = conflict.end();
        }

        TimeRange possibleTime = TimeRange.fromStartEnd(start, TimeRange.END_OF_DAY, true);
        if (possibleTime.duration() >= duration) {
            meetingTimes.add(possibleTime);
        }
        
        return meetingTimes;
    }
}
