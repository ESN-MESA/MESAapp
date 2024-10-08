import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import {
  GetEventRegistrationCodeCountGQL,
  GetEventRegistrationCodeCountQuery,
  GetEventRegistrationCodesGQL,
  GetEventRegistrationCodesQuery,
} from '@tumi/legacy-app/generated/generated';
import { map, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tenant-move-orders-page',
  templateUrl: './tenant-move-orders-page.component.html',
  styleUrls: ['./tenant-move-orders-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantMoveOrdersPageComponent implements OnDestroy {
  public codes$: Observable<
    GetEventRegistrationCodesQuery['eventRegistrationCodes']
  >;
  public codesCount$: Observable<
    GetEventRegistrationCodeCountQuery['eventRegistrationCodeCount']
  >;
  public displayedColumns = [
    'event',
    'creator',
    'created',
    'receiver',
    'used',
    'status',
  ];
  private ordersQueryRef;

  constructor(
    private getEventRegistrationCodesGQL: GetEventRegistrationCodesGQL,
    private getEventRegistrationCodeCountGQL: GetEventRegistrationCodeCountGQL
  ) {
    this.ordersQueryRef = this.getEventRegistrationCodesGQL.watch({
      pageLength: 20,
      pageIndex: 0,
    });
    this.codesCount$ = this.getEventRegistrationCodeCountGQL
      .watch()
      .valueChanges.pipe(map(({ data }) => data.eventRegistrationCodeCount));
    this.ordersQueryRef.startPolling(5000);
    this.codes$ = this.ordersQueryRef.valueChanges.pipe(
      map(({ data }) => data.eventRegistrationCodes)
    );
  }

  ngOnDestroy(): void {
    this.ordersQueryRef.stopPolling();
  }

  updatePage($event: PageEvent) {
    this.ordersQueryRef.refetch({
      pageIndex: $event.pageIndex,
      pageLength: $event.pageSize,
    });
  }
}
